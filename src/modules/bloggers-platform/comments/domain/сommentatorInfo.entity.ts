import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  _id: false,
})
export class СommentatorInfo {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  userLogin: string;
}

export const СommentatorInfoSchema = SchemaFactory.createForClass(СommentatorInfo);