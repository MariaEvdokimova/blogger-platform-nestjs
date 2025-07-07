import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UserContextDto } from 'src/modules/user-accounts/dto/user-context.dto';

export const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserContextDto => {
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {      
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'there is no user in the request object!',
      });
      //throw new Error('there is no user in the request object!');
    }

    return user;
  },
);
