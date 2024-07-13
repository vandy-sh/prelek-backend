import { Builder } from 'builder-pattern';
import { Response } from 'express';
import {
  BaseHttpPaginatedResponseDto,
  BaseHttpResponseDto,
} from '../dtos/base.http.response.dto';

// export interface BaseHttpResponseHelperRequest<T, K> {
//   res: Response;
//   data: T;
//   message: string;
//   statusCode: number;
//   error?: K;
// }

export function httpResponseHelper<T, K>(
  res: Response,
  props: Partial<BaseHttpResponseDto<T, K>>,
): Response<BaseHttpResponseDto<T, K>> {
  const { data, message, statusCode, error } = props;

  const buildedResponse = Builder<BaseHttpResponseDto<T, K>>({
    message: message || 'Success',
    statusCode: statusCode || 200,
    data,
    error,
  }).build();

  return res.status(statusCode || 200).json(buildedResponse);
}

export function httpPaginatedResponseHelper<T, K>(
  res: Response,
  props: Partial<BaseHttpPaginatedResponseDto<T, K>>,
): Response<BaseHttpPaginatedResponseDto<T, K>> {
  const {
    data,
    message,
    statusCode,
    error,
    total = 1,
    currentPage = 1,
    limit = 0,
  } = props;

  const lastPage = Math.ceil(total / limit);
  const nextPage = currentPage + 1;
  const hasNextPage = limit === 0 ? false : currentPage < lastPage;
  const prevPage = currentPage - 1;
  const hasPrevPage = limit === 0 ? false : currentPage > 1;

  const buildedResponse = Builder<BaseHttpPaginatedResponseDto<T, K>>({
    message: message || 'Success',
    statusCode: statusCode || 200,
    data,
    error,
    total,
    currentPage,
    limit,
    nextPage,
    hasNextPage,
    prevPage,
    hasPrevPage,
  }).build();

  return res.status(statusCode || 200).json(buildedResponse);
}
