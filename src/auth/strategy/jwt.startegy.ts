import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import { User } from '../../schemas/user.schema';
import { UsersService } from '../../users/users.service';

interface IPayload {
  id: string;
  iat: number;
  exp: number;
}

const cookieExtractor = (req: Request) => {
  return req && req.cookies ? req.cookies.token : null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT}`,
      jwtFromRequest: cookieExtractor,
    });
  }

  async validate(payload: IPayload): Promise<User> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne(payload.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
