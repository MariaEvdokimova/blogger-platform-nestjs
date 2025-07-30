import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSetup(app); //глобальные настройки приложения

  app.use(cookieParser());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true, // если используете куки (например, для refreshToken)
  });

  const PORT = process.env.PORT || 5005; 
  await app.listen( PORT );
}
bootstrap();
