import { ApiProperty } from "@nestjs/swagger";
import { contentConstraints } from "../../domain/comment.entity";
import { IsStringWithTrim } from "../../../../../core/decorators/validation/is-string-with-trim"


export class CommentInputDto {
  @ApiProperty({
    minLength: contentConstraints.minLength,
    maxLength: contentConstraints.maxLength,
    example: 'stringstringstringst',
  })
  @IsStringWithTrim(contentConstraints.minLength, contentConstraints.maxLength)
  content: string;
}
