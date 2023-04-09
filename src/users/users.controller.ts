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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot();

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('verify')
  async email(@Req() req: Request) {
    try {
      const { email } = req.body;
      const user = await this.usersService.findEmail(email);
      if (!user.length) {
        const payload = {
          email: email,
          userId: randomBytes(6).toString('base64'),
          username: email.substring(0, email.indexOf('@')).replaceAll('.', ''),
          name: email.substring(0, email.indexOf('@')).replaceAll('.', ''),
        };
        const token = jwt.sign(
          { userId: payload.userId, email: payload.email },
          process.env.JWT_SECRET,
          { expiresIn: '365d' },
        );
        const verify = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });
        return this.usersService.sendEmail(email, token, verify);
      } else {
        const token = jwt.sign(
          { userId: user[0].userId, email: user[0].email },
          process.env.JWT_SECRET,
          { expiresIn: '365d' },
        );
        return this.usersService.sendEmail(email, token, null);
      }
    } catch (error) {
      return { error: 'An error occured' };
    }
  }

  @Get('verify/:token')
  async verified(@Param('token') token: string) {
    try {
      const payload = await this.usersService.jwtVerify(token);
      const user = await this.usersService.findEmail(payload.email);
      if (!user.length) this.usersService.create(payload);
      return JSON.stringify(payload);
    } catch (error) {
      return { error: 'An error occured' };
    }
  }

  @Get('this')
  async getUser(@Req() req: Request) {
    return this.usersService.getUser(req.cookies.token);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.create(createUserDto);
    } catch (error) {
      return { error: 'An error occured' };
    }
  }

  @Get('checktoken')
  async checktoken(@Req() req: Request) {
    console.log(req.cookies.token);
    return this.usersService.jwtVerify(req.cookies.token);
  }

  @Get('user/:userid')
  async userProfile(@Param('userid') userid: string, @Req() req: Request) {
    try {
      if (req.cookies.token)
        var { userId } = await this.usersService.jwtVerify(req.cookies.token);
      const user = await this.usersService.findUserId(userid);
      if (!user.length || user[0].blocked) return { error: 'An error occured' };
      const payload: any = {
        name: user[0].name,
        username: user[0].username,
        userId: user[0].userId,
        bio: user[0].bio,
        about: user[0].about,
        location: user[0].location,
        profilePhoto: user[0].profilePhoto,
        socialLinks: user[0].socialLinks,
        likes: user[0].likes,
        views: user[0].views,
        saves: user[0].saves,
        comments: user[0].comments,
        followers: user[0].followers,
        totalPosts: user[0].posts.length,
      };
      if (userid === userId) {
        payload.followed = user[0].followed;
        payload.posts = user[0].posts;
        payload.liked = user[0].liked;
        payload.viewed = user[0].viewed;
        payload.saved = user[0].saved;
      }
      return payload;
    } catch (error) {
      return { error: 'An error occured' };
    }
  }
}
