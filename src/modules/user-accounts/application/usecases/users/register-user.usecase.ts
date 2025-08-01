import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserDto } from "../../../../user-accounts/dto/create-user.dto";
import { UsersRepository } from "../../../../user-accounts/infrastructure/users.repository";
import { UsersFactory } from "../../factories/users.factory";
import { DomainException } from "../../../../../core/exceptions/domain-exceptions";
import { DomainExceptionCode } from "../../../../../core/exceptions/domain-exception-codes";
import { UuidService } from "../../services/uuid.service";
import { EmailExamples } from "../../../../notifications/email-examples";
import { UserRegisteredEvent } from "../../../../user-accounts/domain/events/user-registered.event";

export class RegisterUserCommand {
  constructor(public dto: CreateUserDto) {}
}

/**
 * Регистрация пользователя через email на странице регистрации сайта
 */
@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private eventBus: EventBus,
    private usersRepository: UsersRepository,
    private usersFactory: UsersFactory,
    private uuidService: UuidService,
    private emailExamples: EmailExamples,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<void> {
    try {
      const userWithTheSameLoginOrMail = await this.usersRepository.doesExistByLoginOrEmail(
      dto.login,
      dto.email,
    );

    if ( userWithTheSameLoginOrMail ) {
      if ( userWithTheSameLoginOrMail.email === dto.email ) {
        throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User with the same emil already exists',
        extensions: [{
          message: 'User with the same email already exists',
          field: 'email'
        }]
      });
      } else {  
        throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User with the same login already exists',
        extensions: [{
          message: 'User with the same login already exists',
          field: 'login'
        }]
      });
      }
    }
    
      const user = await this.usersFactory.create(dto);
      const confirmCode = this.uuidService.generate();
      user.setConfirmationCode(confirmCode);
      // ивенты могут возвращаться из метода сущности
      //const events = user.setConfirmationCode(confirmCode);
      await this.usersRepository.save(user);

      this.eventBus.publish(new UserRegisteredEvent(user.email, confirmCode, this.emailExamples.registrationEmail));
      // а могут просто накапливаться в сущности и в конце мы можем у неё
      // попросить данные ивенты, чтиобы опубликовать их
      // this.eventBus.publish(user.getEvents());
    } catch {
      // transaction.rollback();
    }
  }
}
