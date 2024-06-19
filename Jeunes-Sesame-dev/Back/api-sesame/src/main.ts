import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('SESAME')
    .setDescription('API des étudiants du programme SESAME')
    .setVersion('1.0.0')
    .addTag('iTeam-$ Community')
    .addBearerAuth()
    // .addServer('/api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  const configService = app.get(ConfigService);
  const SERVER_PORT = +configService.get('SERVER_PORT');
  await app.listen(SERVER_PORT);
}
bootstrap();
