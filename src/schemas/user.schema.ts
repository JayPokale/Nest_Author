import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true, unique: true })
  userId: string;

  @Prop({ type: String, required: true, unique: true })
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

  @Prop([{ platform: String, link: String }])
  socialLinks: { platform: string; link: string }[];

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

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: 0 })
  saves: number;

  @Prop({ type: Number, default: 0 })
  followers: number;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
