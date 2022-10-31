import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(3005);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
