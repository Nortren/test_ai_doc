import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { ServerModule } from 'src/server/server.module';

async function bootstrap() {
  const port = process.env.PORT || 8080;
  const app = await NestFactory.create(ServerModule);

  // Подключение cookie-parser
  app.use(cookieParser());

  // Включение CORS
  app.enableCors({
    origin: '*', // Разрешить доступ с любого домена
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные HTTP-методы
    allowedHeaders: 'Content-Type, Accept', // Разрешенные заголовки
  });

  console.log(`Application started on PORT: ${port}`);
  await app.listen(port);
}

bootstrap();
