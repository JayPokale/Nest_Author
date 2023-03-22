import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type postDocument = HydratedDocument<post>;

@Schema()
export class post {
  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop(String)
  subtitle: string;

  @Prop(String)
  thumbnail: string;

  @Prop(String)
  content: string;

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
}

export const postSchema = SchemaFactory.createForClass(post);
