import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class ImagePayloadSwag {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  base64Data: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagePrefix?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currentPhoto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^[.][^.]+/)
  @IsString()
  imageExtension?: string;
}
