import { Response } from 'express';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBasicAuth, ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { CreateUserInputDto } from "./input-dto/users.input-dto";
import { RegistrationConfirmationInputDto } from "./input-dto/registration-confirmation.input-dto";
import { RegistrationEmailResendingInputDto } from "./input-dto/registration-email-resending.input-dto";
import { UserContextDto } from "../dto/user-context.dto";
import { ExtractUserFromRequest } from "../guards/decorators/param/extract-user-from-request.decorator";
import { LocalAuthGuard } from "../guards/local/local-auth.guard";
import { JwtAuthGuard } from "../guards/bearer/jwt-auth.guard";
import { MeViewDto } from "./view-dto/users.view-dto";
import { PasswordRecoveryInputDto } from "./input-dto/password-recovery.input-dto";
import { NewPasswordInputDto } from "./input-dto/new-password.input-dto";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { RegisterUserCommand } from "../application/usecases/users/register-user.usecase";
import { LoginUserCommand } from "../application/usecases/users/login-user.usecase";
import { PasswordRecoveryCommand } from "../application/usecases/users/password-recovery.usecase";
import { NewPasswordCommand } from "../application/usecases/users/new-password.usecase";
import { RegistrationConfirmationCommand } from "../application/usecases/users/registration-confirmation.usecase";
import { RegistrationEmailResendingCommand } from "../application/usecases/users/registration-email-resending.usecase";
import { GetMeQuery } from "../application/queries/get-me.query";
import { RequestMetadata } from "../guards/decorators/request-metadata.decorator";
import { RequestMetadataDto } from "../dto/request-metadata.dto";
import { cookieConfig } from "../../../core/config/cookie.config";
import { RateLimitGuard } from '../guards/rate-limit.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(RateLimitGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  //swagger doc
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        loginOrEmail: { type: 'string', example: 'login123' },
        password: { type: 'string', example: 'superpassword' },
      },
    },
  })
  async login(
    @RequestMetadata() metadata: RequestMetadataDto,
    @ExtractUserFromRequest() user: UserContextDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
   
    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginUserCommand,
      { accessToken: string, refreshToken: string }
    >(new LoginUserCommand({ userId: user.id, metadata }));

    response.cookie(cookieConfig.refreshToken.name, refreshToken, {
      httpOnly: cookieConfig.refreshToken.httpOnly, 
      secure: cookieConfig.refreshToken.secure,
      path: '/',
    });

    return { accessToken };
  }
  
  @UseGuards(RateLimitGuard)
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  passwordRecovery(@Body() body: PasswordRecoveryInputDto): Promise<void>{
    return this.commandBus.execute(new PasswordRecoveryCommand( body ));
    //return this.authService.passwordRecovery( body );
  }

  @UseGuards(RateLimitGuard)
  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  newPassword (@Body() body: NewPasswordInputDto): Promise<void>{
    return this.commandBus.execute(new NewPasswordCommand( body ));
//    return this.authService.newPassword( body );
  }

  @UseGuards(RateLimitGuard)
  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  registration(@Body() body: CreateUserInputDto): Promise<void> {
    return this.commandBus.execute(new RegisterUserCommand(body));
    //return this.usersService.registerUser(body);
  }
  
  @UseGuards(RateLimitGuard)
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  registrationConfirmation(@Body() body: RegistrationConfirmationInputDto): Promise<void> {
    return this.commandBus.execute(new RegistrationConfirmationCommand( body ));
    //return this.usersService.registrationConfirmation(body);
  }

  @UseGuards(RateLimitGuard)
  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  registrationEmailResending(@Body() body: RegistrationEmailResendingInputDto): Promise<void> {
    return this.commandBus.execute(new RegistrationEmailResendingCommand( body ));
//    return this.usersService.registrationEmailResending(body);
  }

  @ApiBearerAuth('JwtAuth')
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.queryBus.execute( new GetMeQuery( user )); 
    //this.authQueryRepository.me(user.id);
  }
}
