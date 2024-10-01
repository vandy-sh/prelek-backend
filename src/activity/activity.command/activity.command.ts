import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../prisma/prisma.service';
import { AwsS3Service } from '../../lib/aws-s3/usecase/aws-s3.service';
import { MIME_TYPE } from '../../core/enums/file-mimetype.enum';
import { FileMimeTypeEnum } from '../../core/enums/allowed-filetype.enum';
import { nanoid } from 'nanoid';
import { Prisma } from '@prisma/client';

export class ActivityAddCommand {
  title: string;
  description: string;
  price: number;
  qty: number;
  activity_photos: Express.Multer.File[];
  invoice_photos: Express.Multer.File[];
}

export class ActivityAddCommandResult {
  data: any;
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
    uploadedFiles: MediaCreateObj[],
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
    const { invoice_photos, activity_photos, ...rest } = command;
    const uploadedFile: MediaCreateObj[] = [];

    try {
      console.dir(command, { depth: null });
      // validasi files apakah ada file aktivitas dan file invoice
      if (!activity_photos) {
        throw new BadRequestException(`Activity photos is required!`);
      }

      if (!invoice_photos) {
        throw new BadRequestException(`Invoice photos is required!`);
      }

      const activityId = nanoid();

      // upload gambar
      // upload activity
      await this.upload(
        activity_photos,
        [FileMimeTypeEnum.JPEG, FileMimeTypeEnum.JPG, FileMimeTypeEnum.PNG],
        'images/activity',
        uploadedFile,
        activityId,
        'activity',
      );

      // upload invoice
      await this.upload(
        invoice_photos,
        [FileMimeTypeEnum.JPEG, FileMimeTypeEnum.JPG, FileMimeTypeEnum.PNG],
        'images/invoice',
        uploadedFile,
        activityId,
        'invoice',
      );

      // buat activity
      const activityCreate = await this.prisma.activity.create({
        data: {
          id: activityId,
          description: rest.description,
          title: command.title,
          start_date: new Date(),
        },
      });

      const activityTransaction = await this.prisma.$transaction(async (tx) => {
        // buat Media berdasarkan uploadedFile array buat dengan prisma.media.createMany() nanti si uploadedFile cast ke unknown terus cast jadi Prisma.MediaCreateManyInput[]
        await this.prisma.media.createMany({
          data: uploadedFile as Prisma.MediaCreateManyInput[],
        });

        // buat pengurangan ke wallet admin

        const adminWallet = await this.prisma.wallet.findFirst({
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

        const subscriptionAdminWallet = await this.prisma.wallet.update({
          where: {
            id: adminWallet.id,
          },
          data: {
            balance: {
              decrement: activityCreate.description.length * command.price,
            },
          },
        });
      });
      throw new BadRequestException('Testing');

      // buat transaksi
      return new ActivityAddCommandResult();
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
