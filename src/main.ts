import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import * as net from 'net';

// Hàm kiểm tra port có khả dụng không
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
}

// Hàm tìm port khả dụng
async function findAvailablePort(startPort: number, maxAttempts = 10): Promise<number> {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`Không tìm thấy port khả dụng từ ${startPort} đến ${startPort + maxAttempts - 1}`);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // Enable CORS
  app.enableCors();

  const defaultPort = parseInt(process.env.PORT || '9933', 10);
  let port = defaultPort;

  try {
    // Kiểm tra port có khả dụng không
    const portAvailable = await isPortAvailable(port);
    if (!portAvailable) {
      console.warn(`⚠️  Port ${port} đang được sử dụng, đang tìm port khả dụng...`);
      port = await findAvailablePort(defaultPort);
      console.log(`✅ Đã tìm thấy port khả dụng: ${port}`);
    }

    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} đang được sử dụng. Vui lòng:`);
      console.error(`   1. Dừng ứng dụng đang chạy trên port ${port}`);
      console.error(`   2. Hoặc đặt biến môi trường PORT để sử dụng port khác`);
      process.exit(1);
    } else {
      console.error('❌ Lỗi khi khởi động ứng dụng:', error);
      process.exit(1);
    }
  }
}
bootstrap();
