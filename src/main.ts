import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle(process.env.PROJECTNAME)
    .setDescription(process.env.PROJECTDESCRIPTION)
    .setVersion(process.env.PROJECTVERSION)
    .addTag('')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(process.env.SWAGGERPATH, app, document);

  app.use(cookieParser());

  await app.listen(3000);
}

bootstrap();
