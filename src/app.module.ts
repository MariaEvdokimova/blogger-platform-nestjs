import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingModule } from './modules/testing/testing.module';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { BloggersPlatformModule } from './modules/bloggers-platform/bloggers-platform.module';
import { APP_FILTER } from '@nestjs/core';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest-bloggers-platform'), //TODO: move to env. will be in the following lessons
    UserAccountsModule,
    TestingModule,
    BloggersPlatformModule,
    //CoreModule,
  ],
  controllers: [],//AppController
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainHttpExceptionsFilter,
    },
  ],//AppService
})
export class AppModule {}
