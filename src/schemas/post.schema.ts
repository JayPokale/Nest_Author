import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop(String)
  profilePhoto: string;

  @Prop(String)
  name: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop(String)
  subtitle: string;

  @Prop(String)
  thumbnail: string;

  @Prop([{ type: String, data: Object }])
  content: { type: string; data: object }[];

  @Prop({ type: Boolean, required: true, default: true })
  active: boolean;

  @Prop([String])
  comments: string[];

  @Prop([String])
  categories: string[];

  @Prop(Number)
  likes: number;

  @Prop(Number)
  views: number;

  @Prop(Number)
  saves: number;

  @Prop({ default: now() })
  createdAt: Date;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
