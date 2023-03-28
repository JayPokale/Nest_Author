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
    } catch (err) {
      return { err: 'An error occured' };
    }
  }

  @Get('verify/:token')
  async verified(@Param('token') token: string) {
    try {
      const payload = await this.usersService.jwtVerify(token);
      const user = await this.usersService.findEmail(payload.email);
      if (!user.length) this.usersService.create(payload);
      return JSON.stringify(payload);
    } catch (err) {
      return { err: 'An error occured' };
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
    } catch (err) {
      return { err: 'An error occured' };
    }
  }
}
