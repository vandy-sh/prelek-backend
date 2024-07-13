import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseHttpPaginatedResponseDto } from '../dtos/base.http.response.dto';

export const BasePaginationApiOkResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  total?: number,
  options?: ApiResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(BaseHttpPaginatedResponseDto, dataDto),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseHttpPaginatedResponseDto) },
          {
            properties: {
              data: { type: 'array', items: { $ref: getSchemaPath(dataDto) } },
              // total,
            },
          },
        ],
        // anyOf: { $ref: getSchemaPath(dataDto) },
      },
    }),
  );
