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
    } catch (err) {
      console.log(err);
      return { err: "An error occures", postId: null };
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

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
