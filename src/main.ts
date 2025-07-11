import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appSetup } from './setup/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSetup(app); //глобальные настройки приложения

  const PORT = process.env.PORT || 5005; 
  await app.listen( PORT );
}
bootstrap();
