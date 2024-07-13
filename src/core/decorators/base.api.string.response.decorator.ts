import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseHttpResponseDto } from '../dtos/base.http.response.dto';

export const BaseApiStringResponse = (options?: ApiResponseOptions) =>
  applyDecorators(
    ApiExtraModels(BaseHttpResponseDto),
    ApiOkResponse({
      ...options,
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseHttpResponseDto) },
          {
            properties: {
              data: { type: 'string' },
            },
          },
        ],
      },
    }),
  );
