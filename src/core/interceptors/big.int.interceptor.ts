import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntToStringInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => this.serializeBigInts(data)), // Specify the type of 'data'
    );
  }

  private serializeBigInts(data: any): any {
    if (typeof data === 'object') {
      for (const key in data) {
        if (data.hasOwnProperty(key) && typeof data[key] === 'bigint') {
          data[key] = data[key].toString();
        }
      }
    }
    return data;
  }
}
