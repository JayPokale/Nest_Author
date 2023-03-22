import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  commentId: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Boolean, required: true, default: false })
  deleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
