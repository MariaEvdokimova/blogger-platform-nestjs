import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "../application/users.service";
import { AuthService } from "../application/auth.service";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { CreateUserInputDto } from "./input-dto/users.input-dto";
import { RegistrationConfirmationInputDto } from "./input-dto/registration-confirmation.input-dto";
import { RegistrationEmailResendingInputDto } from "./input-dto/registration-email-resending.input-dto";
import { UserContextDto } from "../dto/user-context.dto";
import { ExtractUserFromRequest } from "../guards/decorators/param/extract-user-from-request.decorator";
import { LocalAuthGuard } from "../guards/local/local-auth.guard";
import { JwtAuthGuard } from "../guards/bearer/jwt-auth.guard";
import { MeViewDto } from "./view-dto/users.view-dto";
import { AuthQueryRepository } from "../infrastructure/query/auth.query-repository";
import { PasswordRecoveryInputDto } from "./input-dto/password-recovery.input-dto";
import { NewPasswordInputDto } from "./input-dto/new-password.input-dto";

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private authQueryRepository: AuthQueryRepository,
  ) {}
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
  login(
    /*@Request() req: any*/
     @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(user.id);
  }
  
  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  passwordRecovery(@Body() body: PasswordRecoveryInputDto): Promise<void>{
    return this.authService.passwordRecovery( body );
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  newPassword (@Body() body: NewPasswordInputDto): Promise<void>{
    return this.authService.newPassword( body );
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  registration(@Body() body: CreateUserInputDto): Promise<void> {
    return this.usersService.registerUser(body);
  }
  
  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  registrationConfirmation(@Body() body: RegistrationConfirmationInputDto): Promise<void> {
    return this.usersService.registrationConfirmation(body);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  registrationEmailResending(@Body() body: RegistrationEmailResendingInputDto): Promise<void> {
    return this.usersService.registrationEmailResending(body);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }
}
