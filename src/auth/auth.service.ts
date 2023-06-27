import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { CookieOptions, Response } from 'express';
import { Model } from 'mongoose';

import { OkResponseDto } from '../dto/responses/ok.response.dto';
import { User } from '../schemas/user.schema';
import { matchPassword } from '../utils/bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) readonly userModel: Model<User>,
  ) {}

  async login(res: Response, dto: LoginDto): Promise<OkResponseDto> {
    const user = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user) {
      throw new NotFoundException('User not found or bad credentials');
    }

    const pwMatch = await matchPassword(dto.password, user.password);

    if (!pwMatch) {
      throw new NotFoundException('User not found or bad credentials');
    }

    if (!user.activated) {
      throw new ForbiddenException('You must first activate your account');
    }

    const cookieOptions: CookieOptions = {
      domain: process.env.COOKIE_DOMAIN,
      httpOnly: true,
      secure: Boolean(process.env.NODE_ENV !== 'dev'),
    };

    const oneWeekDate = new Date(new Date().setDate(new Date().getDate() + 7));

    if (dto.rememberMe) {
      cookieOptions.expires = oneWeekDate;
    }

    const token = this.jwtService.sign(
      { id: user._id },
      { secret: process.env.JWT },
    );

    res.cookie('token', token, cookieOptions);

    this.logger.log(`login: USER ${user.email} - LOGGED IN`);

    return {
      ok: true,
    };
  }

  async me(id: string): Promise<User> {
    return this.userModel
      .findById(id)
      .populate('courses.course')
      .populate('courses.watchedLessons')
      .sort({
        'courses.watchedLessons': -1,
      });
  }

  logout(res: Response): OkResponseDto {
    res.clearCookie('token');

    return {
      ok: true,
    };
  }
}
