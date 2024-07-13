import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseHttpResponseDto<T, K = any> {
  @ApiProperty()
  message: string = 'Success';
  @ApiProperty()
  statusCode: number = 200;
  @ApiProperty()
  data: T;
  @ApiPropertyOptional()
  error?: Partial<K>;
}

export class BaseHttpPaginatedResponseDto<
  T,
  K = any,
> extends BaseHttpResponseDto<T, K> {
  @ApiProperty()
  total: number = 1;

  @ApiProperty()
  currentPage: number = 1;

  @ApiProperty()
  limit: number = 0;

  @ApiProperty()
  nextPage: number = 1;

  @ApiProperty()
  hasNextPage: boolean = false;

  @ApiProperty()
  prevPage: number = 1;

  @ApiProperty()
  hasPrevPage: boolean = false;
}

export class BasePaginationProps {
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
}
