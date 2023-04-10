import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';
import { randomBytes } from 'crypto';

export interface postPayload {
  title: string;
  subtitle: string | undefined;
  thumbnail: string | undefined;
  content: string | undefined;
  userId: string;
  postId: string;
}

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userServise: UsersService,
  ) {}

  @Post('upload')
  async create(@Req() req: Request) {
    try {
      const user = await this.userServise.getUser(req.headers.token as string);
      const payload = req.body;
      if (user.userId) {
        const postUser = await this.userServise.findUserId(user.userId);
        payload.name = postUser[0].name;
        payload.profilePhoto = postUser[0].profilePhoto;
        payload.userId = user.userId;
        payload.postId = randomBytes(7).toString('base64').substring(0, 10);
        const post = this.postsService.create(payload as postPayload);
        this.userServise.postId(payload.userId, payload.postId);
        return post;
      } else return { error: 'An error occured' };
    } catch (error) {
      return { error: 'An error occured' };
    }
  }

  @Get('customfetch/:postId')
  async customFetch(@Param('postId') postId: string) {
    try {
      const post: any = await this.postsService.findPost(postId);
      if (!post.length || !post[0].active) return { error: 'An error occured' };
      const user: any = await this.userServise.findUserId(post[0].userId);

      return {
        post: post[0],
        user: {
          name: user[0].name,
          username: user[0].username,
          userId: user[0].userId,
          bio: user[0].bio,
          location: user[0].location,
          profilePhoto: user[0].profilePhoto,
          followers: user[0].followers,
        },
      };
    } catch (error) {
      return { error: 'An error occured' };
    }
  }

  @Get('fetchforedit/:postId')
  async fetchForEdit(@Param('postId') postId: string) {
    try {
      const post: any = await this.postsService.findPost(postId);
      if (!post.length || !post[0].active) return { error: 'An error occured a' };
      return post[0];
    } catch (error) {
      return { error: 'An error occured b' };
    }
  }

  @Get(':skip/:limit')
  findWithSkip(@Param('skip') skip: number, @Param('limit') limit: number) {
    return this.postsService.findWithSkip(skip, limit);
  }

  // Note in use
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':postId')
  async update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ) {
    try {
      const user = await this.userServise.getUser(req.headers.token as string);
      if (user.userId) {
        return this.postsService.update(postId, updatePostDto);
      } else {
        return { error: 'An error occured' };
      }
    } catch (error) {
      return { error: 'An error occured' };
    }
  }

  @Delete(':postId')
  remove(@Param('postId') postId: string) {
    return this.postsService.remove(postId);
  }
}
