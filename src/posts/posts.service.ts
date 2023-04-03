import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from 'src/schemas/post.schema';
import { UpdatePostDto } from './dto/update-post.dto';
import { postPayload } from './posts.controller';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private PostModel: Model<PostDocument>) {}

  async create(payload: postPayload) {
    try {
      return new this.PostModel(payload).save();
    } catch (error) {
      return { error: 'An error occures', postId: null };
    }
  }

  findPost(postId: string) {
    return this.PostModel.find({ postId });
  }

  findWithSkip(skip: number, limit: number) {
    return this.PostModel.find({ active: true }).skip(skip).limit(limit);
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(postId: string, updatePostDto: UpdatePostDto) {
    return this.PostModel.updateOne({ postId }, { $set: updatePostDto });
  }

  remove(postId: string) {
    return this.PostModel.deleteOne({ postId });
  }
}
