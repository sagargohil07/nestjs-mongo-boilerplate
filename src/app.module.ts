import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './modules/upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessagesModule } from './modules/messages/messages.module';
import { MiddlewareModule } from './middleware/middleware.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb+srv://sagarkgohil123_db_user:mZGkApCGe3OZmsAl@boilerplate.tlhtdp2.mongodb.net/?appName=BoilerPlate',
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    AuthModule,
    UserModule,
    UploadModule,
    MulterModule.register({
      dest: './public/images',
    }),
    MessagesModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
