import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentsRepository } from "../../infrastructure/comments.repository";
import { DomainException } from "../../../../../core/exceptions/domain-exceptions";
import { DomainExceptionCode } from "../../../../../core/exceptions/domain-exception-codes";
import { UserContextDto } from "../../dto/user-context.dto";

export class DeleteCommentCommand {
  constructor(
    public commentId: string,
    public user: UserContextDto
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand, void>
{
  constructor(private commentsRepository: CommentsRepository) {
    //console.log('DeleteUserUseCase created!');
  }

  async execute({ commentId, user }: DeleteCommentCommand): Promise<void> {
    const comment = await this.commentsRepository.findOrNotFoundFail( commentId );

    const commentVerifyed = await this.commentsRepository.verifyUserOwnership( commentId, user.id);
    if ( !commentVerifyed ) {
      throw new DomainException({
        code: DomainExceptionCode.Forbidden,
        message: 'Forbidden',
      });
    }

    commentVerifyed.makeDeleted();
    await this.commentsRepository.save( commentVerifyed );

    return;
  }
}
