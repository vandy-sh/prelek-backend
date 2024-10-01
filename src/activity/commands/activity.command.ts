import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { FileMimeTypeEnum } from '../../core/enums/allowed-filetype.enum';
import { AwsS3Service } from '../../lib/aws-s3/usecase/aws-s3.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityDetailDto } from '../dtos/activity.dtos';
import { TRANSACTION_TYPE_ENUM } from '../../transaction/entities/transaction.entities';
import { ActivityEntity } from '../entities/activity.entity';

export class ActivityAddCommand {
  title: string;
  description: string;
  start_date: Date;
  activity_photos: Express.Multer.File[];
  invoice_photos: Express.Multer.File[];
  activity_detail: ActivityDetailDto[];
}

export class ActivityAddCommandResult {
  data: ActivityEntity;
}

export class MediaCreateObj {
  name: string;
  size: number;
  mime_type: string;
  url: string;
  media_type: string;
  id?: string;
  activity_id?: string;
}

@CommandHandler(ActivityAddCommand)
export class ActivityAddCommandHandler
  implements ICommandHandler<ActivityAddCommand, ActivityAddCommandResult>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: AwsS3Service,
  ) {}

  async upload(
    files: Express.Multer.File[],
    allowedFileTypes: FileMimeTypeEnum[],
    path: string,
    uploadedFiles: Prisma.MediaCreateManyInput[],
    activity_id: string,
    media_type: string,
  ) {
    try {
      // upload gambar
      for (const file of files) {
        const uploadedFile = await this.s3.uploadFile(
          file,
          allowedFileTypes,
          path,
        );

        uploadedFiles.push({
          id: nanoid(),
          mime_type: uploadedFile.mime_type,
          name: uploadedFile.name,
          size: uploadedFile.size,
          url: uploadedFile.url,
          activity_id,
          media_type,
        });
      }
    } catch (error) {
      if (uploadedFiles.length) {
        for (const file of uploadedFiles) {
          await this.s3.deleteFile(file.url);
        }
      }
      throw error;
    }
  }

  async execute(
    command: ActivityAddCommand,
  ): Promise<ActivityAddCommandResult> {
    const { invoice_photos, activity_photos, activity_detail, ...rest } =
      command;
    const uploadedFile: Prisma.MediaCreateManyInput[] = [];

    try {
      // console.dir(command, { depth: null });
      // validasi files apakah ada file aktivitas dan file invoice
      if (!activity_photos) {
        throw new BadRequestException(`Activity photos is required!`);
      }

      if (!invoice_photos) {
        throw new BadRequestException(`Invoice photos is required!`);
      }

      const activityId = nanoid();
      const transactionId = nanoid();

      // upload gambar
      // upload activity
      await this.upload(
        activity_photos,
        [FileMimeTypeEnum.JPEG, FileMimeTypeEnum.JPG, FileMimeTypeEnum.PNG],
        'prelek/images/activity',
        uploadedFile,
        activityId,
        'activity',
      );

      // upload invoice
      await this.upload(
        invoice_photos,
        [FileMimeTypeEnum.JPEG, FileMimeTypeEnum.JPG, FileMimeTypeEnum.PNG],
        'prelek/images/invoice',
        uploadedFile,
        activityId,
        'invoice',
      );

      // const transactionDetail:
      const activities: Prisma.ActivityDetailsCreateManyInput[] = [];
      let totalSpend = 0;
      for (const detail of activity_detail) {
        activities.push({
          id: nanoid(),
          activity_id: activityId,
          transaction_id: transactionId,
          title: detail.name,
          description: detail.description,
          price: detail.price,
          quantity: detail.qty,
        });

        totalSpend += detail.price;
      }

      const dbProcess = await this.prisma.$transaction(async (tx) => {
        // buat activity
        await tx.activity.create({
          data: {
            id: activityId,
            transaction_id: transactionId,
            ...rest,
          },
        });

        // buat Media berdasarkan uploadedFile array buat dengan prisma.media.createMany() nanti si uploadedFile cast ke unknown terus cast jadi Prisma.MediaCreateManyInput[]
        await tx.media.createMany({
          data: uploadedFile,
        });

        // cari  admin wallet
        const adminWallet = await tx.wallet.findFirst({
          where: {
            type: 'VAULT',
          },
          include: {
            user: true,
          },
        });
        if (!adminWallet) {
          throw new NotFoundException(`Admin wallet not found!`);
        }

        // jika admin wallet saldonya kurang dari totalSpend maka throw error
        if (adminWallet.balance < totalSpend) {
          throw new BadRequestException(`Admin wallet balance is not enough!`);
        }

        // kurangi admin wallet
        await tx.wallet.update({
          where: {
            id: adminWallet.id,
          },
          data: {
            balance: {
              decrement: totalSpend,
            },
          },
        });

        // buat transaksi
        await tx.transaction.create({
          data: {
            id: transactionId,
            total_amount: totalSpend,
            transaction_type: TRANSACTION_TYPE_ENUM.EXPANSES,
            activity_id: activityId,
            user_id: adminWallet.userid,
            wallet_id: adminWallet.id,
          },
        });

        // buat transaction detail
        await tx.activityDetails.createMany({
          data: activities,
        });

        const createdActivities = tx.activity.findFirst({
          where: {
            id: activityId,
          },
          include: {
            activity_details: true,
            photos: true,
          },
        });

        return createdActivities;
      });

      return {
        data: dbProcess,
      };
    } catch (error) {
      if (uploadedFile.length) {
        for (const file of uploadedFile) {
          await this.s3.deleteFile(file.url);
        }
      }
      throw error;
    }
  }
}
