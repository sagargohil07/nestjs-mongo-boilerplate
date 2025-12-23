import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  // Global response interceptor for success responses
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // Global exception filter for error responses
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // app.use('/api');
  // const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector));
  
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server successfully started on port ${process.env.PORT}`);
  });
}
bootstrap();
