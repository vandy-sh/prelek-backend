import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiCreatedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { BaseHttpResponseDto } from '../dtos/base.http.response.dto';

export const ApiCreatedBaseResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(BaseHttpResponseDto, model),
    ApiCreatedResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseHttpResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
