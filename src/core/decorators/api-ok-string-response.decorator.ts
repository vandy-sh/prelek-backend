import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { BaseHttpResponseDto } from '../dtos/base.http.response.dto';

export const ApiOkStringResponse = () => {
  return applyDecorators(
    ApiExtraModels(BaseHttpResponseDto),
    ApiOkResponse({
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
};
