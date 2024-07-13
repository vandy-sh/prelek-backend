import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseHttpResponseDto } from '../dtos/base.http.response.dto';

export const BaseApiOkResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  type: 'object' | 'array' = 'object',
  options?: ApiResponseOptions,
) =>
  applyDecorators(
    ApiExtraModels(BaseHttpResponseDto, dataDto),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseHttpResponseDto) },
          {
            properties: {
              data:
                type === 'array'
                  ? { type: type, items: { $ref: getSchemaPath(dataDto) } }
                  : { $ref: getSchemaPath(dataDto) },
            },
          },
        ],
        // anyOf: { $ref: getSchemaPath(dataDto) },
      },
    }),
  );
