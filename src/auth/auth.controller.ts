import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CurrentUser } from '../decorators/current-user.decorator';
import { Serialize } from '../decorators/serialize.decorator';
import { OkResponseDto } from '../dto/responses/ok.response.dto';
import { User } from '../schemas/user.schema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetMeResponsesDto } from './dto/responses/get-me.responses.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiCreatedResponse({ type: OkResponseDto })
  @ApiException(() => [NotFoundException, ForbiddenException])
  @Post('/login')
  login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginDto) {
    return this.authService.login(res, dto);
  }

  @ApiOperation({ summary: 'User logout' })
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: OkResponseDto })
  @ApiException(() => [UnauthorizedException])
  @UseGuards(AuthGuard('jwt'))
  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @ApiOperation({ summary: 'Get auth confirmation' })
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: GetMeResponsesDto })
  @ApiException(() => [UnauthorizedException])
  @UseGuards(AuthGuard('jwt'))
  @Serialize(GetMeResponsesDto)
  @Get('/me')
  getAuth(@CurrentUser() currentUser: User) {
    return this.authService.me(currentUser._id);
  }
}
