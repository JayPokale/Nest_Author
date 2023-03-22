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
    return new this.UserModel(createUserDto).save();
  }

  // Not in use
  async findAll() {
    return this.UserModel.find();
  }

  async findEmail(email: string) {
    return this.UserModel.find({ email });
  }

  async findUserId(userId: string) {
    return this.UserModel.find({ userId });
  }

  // Not in use
  async update(_id: string, updateUserDto: UpdateUserDto) {
    return this.UserModel.updateOne({ _id }, { $set: updateUserDto });
  }

  // Not in use
  async remove(_id: string) {
    return this.UserModel.deleteOne({ _id });
  }

  async sendEmail(email: string, token: string, verify: string) {
    const mail = {
      to: email,
      subject: 'Verification email for AuthorsLog',
      from: 'jay.pokale.35@gmail.com',
      text: 'Authenticate using this link',
      html: `<a href=${process.env.FRONTEND_URI}/verify?token=${token}${
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

  async jwtVerify(token: string) {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  }
}
