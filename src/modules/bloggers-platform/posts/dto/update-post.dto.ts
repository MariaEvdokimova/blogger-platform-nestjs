import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";
import { contentConstraints, shortDescriptionConstraints, titleConstraints } from "../domain/post.entity";
import { IsStringWithTrim } from "../../../../core/decorators/validation/is-string-with-trim";
import { IsString } from "class-validator";

export class UpdatePostDomainDto {
  @ApiProperty({
    minLength: titleConstraints.minLength,
    maxLength: titleConstraints.maxLength,
    example: 'title',
  })
  @IsStringWithTrim(titleConstraints.minLength, titleConstraints.maxLength)
  title:	string;

  @ApiProperty({
    minLength: shortDescriptionConstraints.minLength,
    maxLength: shortDescriptionConstraints.maxLength,
    example: 'shortDescriptionConstraints',
  })
  @IsStringWithTrim(shortDescriptionConstraints.minLength, shortDescriptionConstraints.maxLength)
  shortDescription: string;

  @ApiProperty({
    minLength: contentConstraints.minLength,
    maxLength: contentConstraints.maxLength,
    example: 'shortDescriptionConstraints',
  })
  @IsStringWithTrim(contentConstraints.minLength, contentConstraints.maxLength)
  content:	string;

  @IsString()
  blogId: Types.ObjectId;
}
