import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomLoggerService, LoggingInterceptor, AllExceptionsFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get logger service
  const logger = await app.resolve(CustomLoggerService);
  logger.setContext('Bootstrap');
  
  // Use custom logger for the application
  app.useLogger(logger);
  
  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit type conversion
      },
    }),
  );
  
  // Enable global logging interceptor for all HTTP requests
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  
  // Enable global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  
  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log('Logging system initialized successfully');
  
  // Optional: Clean old logs on startup (keep last 30 days)
  logger.cleanOldLogs(30);
}
bootstrap();
