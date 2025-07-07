import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { UsersService } from './application/users.service';
import { CryptoService } from './application/crypto.service';
import { UuidService } from './application/uuid.service';
import { EmailService } from '../notifications/email.service';
import { EmailExamples } from '../notifications/email-examples';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { LocalStrategy } from './guards/local/local.strategy';
import { AuthService } from './application/auth.service';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { AuthController } from './api/auth.controller';
 
@Module({
  imports: [
    JwtModule.register({
      secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
      signOptions: { expiresIn: '60m' }, // Время жизни токена
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    AuthQueryRepository,
    CryptoService,
    UuidService,
    EmailService,
    EmailExamples,
    JwtStrategy,
    LocalStrategy,


    // SecurityDevicesQueryRepository,
    // UsersExternalQueryRepository,
    // UsersExternalService,
  ],
  exports: [JwtStrategy],
})
export class UserAccountsModule {}
