import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DataWrapInterceptor implements NestInterceptor{
  async intercept(context: ExecutionContext, next: CallHandler): Promise<any>{
    try{
      const res = await lastValueFrom(next.handle())
      return { message: "success", data: res }
    }catch(err){
      return { message: "failed", data: err.message || ''}
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new DataWrapInterceptor())
  await app.listen(3000);
}
bootstrap();
