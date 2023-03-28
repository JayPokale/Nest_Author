import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as jwt from 'jsonwebtoken';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {
    sgMail.setApiKey(process.env.SEND_GRID_KEY);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      return new this.UserModel(createUserDto).save();
    } catch (err) {
      return { err: 'An error occured' };
    }
  }

  async findEmail(email: string) {
    return this.UserModel.find({ email });
  }

  async findUserId(userId: string) {
    return this.UserModel.find({ userId });
  }

  async sendEmail(email: string, token: string, verify: string) {
    const mail = {
      to: email,
      subject: 'Verification email for AuthorsLog',
      from: 'jay.pokale.35@gmail.com',
      text: 'Authenticate using this link',
      html: `<a href=${process.env.FRONTEND_URI}?token=${token}${
        verify ? `&verify=${verify}` : ''
      }>AuthorsLog.com</a>`,
    };
    try {
      await sgMail.send(mail);
      return JSON.stringify({ msg: 'Check your email within 1 hour' });
    } catch (err) {
      // By this, hackers don't get if email exist in database
      return JSON.stringify({ msg: 'Check your email within 1 hour' });
    }
  }

  async getUser(token: string) {
    try {
      if (!token) return { err: 'An error occured', userId: null };
      const { userId } = await this.jwtVerify(token);
      const [{ name, username, email }] = await this.findUserId(userId);
      const payload = { name, username, email, userId };
      console.log(payload)
      return payload;
    } catch (err) {
      console.log(err)
      return { err: 'An error occured', userId: null };
    }
  }

  async jwtVerify(token: string) {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  }
}
