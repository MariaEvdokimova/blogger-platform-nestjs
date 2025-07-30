import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersController } from './api/users.controller';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { CryptoService } from './application/services/crypto.service';
import { UuidService } from './application/services/uuid.service';
import { EmailService } from '../notifications/email.service';
import { EmailExamples } from '../notifications/email-examples';
import { NotificationsModule } from '../notifications/notifications.module';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { LocalStrategy } from './guards/local/local.strategy';
import { AuthQueryRepository } from './infrastructure/query/auth.query-repository';
import { AuthController } from './api/auth.controller';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN, REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from './constants/auth-tokens.inject-constants';
import { CreateUserUseCase } from './application/usecases/admins/create-user.usecase';
import { DeleteUserUseCase } from './application/usecases/admins/delete-user.usecase';
import { LoginUserUseCase } from './application/usecases/users/login-user.usecase';
import { NewPasswordUseCase } from './application/usecases/users/new-password.usecase';
import { RegisterUserUseCase } from './application/usecases/users/register-user.usecase';
import { RegistrationConfirmationUseCase } from './application/usecases/users/registration-confirmation.usecase';
import { RegistrationEmailResendingUseCase } from './application/usecases/users/registration-email-resending.usecase';
import { UsersFactory } from './application/factories/users.factory';
import { PasswordRecoveryUseCase } from './application/usecases/users/password-recovery.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUsersQueryHandler } from './application/queries/get-users.query';
import { GetMeQueryHandler } from './application/queries/get-me.query';
import { AuthService } from './application/services/auth.service';
import { RateLimit, RateLimitSchema } from './domain/rate-limit.entity';
import { RateLimitRepository } from './infrastructure/rate-limit.repository';
 
const commandHandlers = [
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  NewPasswordUseCase,
  RegisterUserUseCase,
  RegistrationConfirmationUseCase,
  RegistrationEmailResendingUseCase,
  PasswordRecoveryUseCase,
];

const queryHandlers = [
  GetUsersQueryHandler,
  GetMeQueryHandler,
];

@Module({
  imports: [
    /*JwtModule.register({
      secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
      signOptions: { expiresIn: '60m' }, // Время жизни токена
    }),*/
    CqrsModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RateLimit.name, schema: RateLimitSchema},
    ]),
    NotificationsModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [    
    ...commandHandlers,
    ...queryHandlers,
    //UsersService,
    UsersRepository,
     {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'access-token-secret', //TODO: move to env. will be in the following lessons
          signOptions: { expiresIn: '6m' },
        });
      },
      inject: [
        /*TODO: inject configService. will be in the following lessons*/
      ],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'refresh-token-secret', //TODO: move to env. will be in the following lessons
          signOptions: { expiresIn: '10m' },
        });
      },
      inject: [
        /*TODO: inject configService. will be in the following lessons*/
      ],
    },
    UsersQueryRepository,
    AuthService, 
    AuthQueryRepository,
    CryptoService,
    UuidService,
    EmailService,
    EmailExamples,
    JwtStrategy,
    LocalStrategy,
    UsersFactory,
    RateLimitRepository,

    // SecurityDevicesQueryRepository,
    // UsersExternalQueryRepository,
    // UsersExternalService,
  ],
  exports: [JwtStrategy, UsersRepository],
})
export class UserAccountsModule {}
