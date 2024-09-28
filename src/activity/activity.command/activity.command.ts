import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PrismaService } from "../../prisma/prisma.service";
import { ActivityEntity } from "../report.entity/activity.entity";

export class ActivityCommand {
  title: string;
  photos: Express.Multer.File[];
  description: string;
  price: number;
  qty: number;
}

export class ActivityCommandResult {
  data: ActivityEntity;
}

@CommandHandler(ActivityCommand)
export class
implements ICommandHandler<ActivityCommand,ActivityCommandResult> {
 constructor (private readonly prisma: PrismaService){}
 async execute(
  command: ActivityCommand,
 ): Promise<ActivityCommandResult>{

  const photos = command.photos.map((file) => ({
    url: file.path,             // Lokasi file yang di-upload
      size: file.size,            // Ukuran file
      mime_type: file.mimetype,   // Tipe MIME file
      media_type: 'IMAGE',   
  }));

  const data = await this.prisma.activity.create({
    data: {
      title: command.title,
      description: command.description,
      price: command.price,
      qty: command.qty,
      photos: {
        create: photos
      },
      include: {
        photos: true, // Include photos dalam hasil query
      },
    },

  });

  return { data };
 }
}
