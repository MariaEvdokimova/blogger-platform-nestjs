import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-bloggers-platform'), //TODO: move to env. will be in the following lessons
    UserAccountsModule,
    TestingModule,
    BloggersPlatformModule,
    //CoreModule,
  ],
  controllers: [],//AppController
  providers: [],//AppService
})
export class AppModule {}
