import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config(); // Load environment variables
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      validationError: {
        target: false,
      },
      exceptionFactory: (errors) => {
        return new BadRequestException(errors);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
