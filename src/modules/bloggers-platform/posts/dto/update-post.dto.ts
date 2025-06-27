import { Types } from "mongoose";

export class UpdatePostDomainDto {
  title:	string;
  shortDescription: string;
  content:	string;
  blogId: Types.ObjectId;
}
