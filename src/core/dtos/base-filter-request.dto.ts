import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BaseFilterRequest {
  /**
   * Page
   */
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  page: number = 1;

  /**
   * Limit
   */
  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @IsNotEmpty()
  limit: number = 0;

  /**
   * sorting
   */
  @ApiPropertyOptional({
    description: 'sort direction (asc or desc, default: desc)',
    default: 'desc',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sort_direction?: string;

  @ApiPropertyOptional({ description: 'sort by column_name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sort_by?: string;
}
