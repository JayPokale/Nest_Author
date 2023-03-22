import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop(String)
  name: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: Boolean, required: true, default: false })
  blocked: boolean;

  @Prop(String)
  bio: string;

  @Prop(String)
  about: string;

  @Prop(String)
  location: string;

  @Prop(String)
  profilePhoto: string;

  @Prop([String])
  posts: string[];

  @Prop([String])
  liked: string[];

  @Prop([String])
  viewed: string[];

  @Prop([String])
  saved: string[];

  @Prop([String])
  comments: string[];

  @Prop(Number)
  likes: number;

  @Prop(Number)
  views: number;

  @Prop(Number)
  saves: number;

  @Prop(Number)
  followers: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
