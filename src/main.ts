import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URI,
  });
  app.use(cookieParser());
  await app.listen(6969);
}
bootstrap();
