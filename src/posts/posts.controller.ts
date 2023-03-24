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

export interface postPayload{
  title: string,
  subtitle: string | undefined,
  thumbnail: string | undefined,
  content: string | undefined,
  userId : string,
  postId : string
}

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userServise: UsersService,
  ) {}

  @Post()
  async create(@Req() req: Request) {
    const user = await this.userServise.getUser(req.cookies.token);
    const payload = req.body;
    console.log(payload)
    payload.userId = user.userId;
    payload.postId = randomBytes(7).toString('base64').substring(0, 10);
    return this.postsService.create(payload as postPayload);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
