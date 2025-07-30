import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { Types } from "mongoose";
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN, REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from "../../../../user-accounts/constants/auth-tokens.inject-constants";
import { RequestMetadataDto } from "../../../../user-accounts/dto/request-metadata.dto";

export class LoginUserCommand {
  constructor(
    public dto: {
      userId: string,
      metadata: RequestMetadataDto
    }) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,

    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
  ) {}

  async execute({ dto }: LoginUserCommand): Promise<{ accessToken: string, refreshToken: string }> {
    let session;
    let payload;

    /*if ( dto.metadata.refreshToken ) {
      payload = await this.refreshTokenContext.verify( dto.metadata.refreshToken );
      if (payload) {
        session = await this.securityDevicesRepository.findByIdAndUserId({ 
          deviceId: payload.deviceId, 
          userId: payload.userId 
        });       
      }
    }*/
    const deviceId =  /*session ? new Types.ObjectId( payload!.deviceId ) :*/ new Types.ObjectId();

    const accessToken = this.accessTokenContext.sign({
      id: dto.userId,
    });

    const refreshToken = this.refreshTokenContext.sign({
      id: dto.userId,
      deviceId: 'deviceId',
    });

    //console.log('', refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
