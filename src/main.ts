import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { seedUsers } from './seed/user';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // فیلدهای اضافی که در DTO نیستند را حذف می‌کند
    forbidNonWhitelisted: true, // اگر فیلد اضافی بفرستند خطا می‌دهد
    transform: true, // داده‌ها را به تایپ مشخص شده تبدیل می‌کند
  }));
  const config = new DocumentBuilder()
    .setTitle('inji soodish kojis?')
    .setDescription('api documantion')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await seedUsers();
  await app.listen(process.env.PORT || 3000);
  
  console.log("running on port", process.env.PORT)
}
bootstrap();
