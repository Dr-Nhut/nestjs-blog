import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //check property don't exist in dto
      forbidNonWhitelisted: true,
      transform: true, //transfrom to an instance DTO
      transformOptions: {
        enableImplicitConversion: true, // transforms from string to boolean | number | ...
      },
    }),
  );

  /**
   * Swagger API doc
   */
  const config = new DocumentBuilder()
    .setTitle('Seft study - Blog API Application')
    .setVersion('1.0')
    .addServer('http://localhost:3000')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, documentFactory);

  /**
   * End setup Swagger module
   */

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
