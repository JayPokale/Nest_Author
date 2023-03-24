import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
ConfigModule.forRoot();

@Module({
  imports: [UsersModule, MongooseModule.forRoot(process.env.MONGO_URI), PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
