import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../decorators/roles.decorator';
import { Serialize } from '../decorators/serialize.decorator';
import { OkResponseDto } from '../dto/responses/ok.response.dto';
import { RolesGuard } from '../guards/roles.guard';
import { FindAllUsersQueryDto } from './dto/find-all-users.query.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password.request.dto';
import { UsersListResponse } from './dto/respones/users-list-item.dto';
import { UserRoleEnum } from './enums/UserRoles.enum';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'User register' })
  @ApiOkResponse({ type: OkResponseDto })
  @Post('/')
  register(@Body() dto: RegisterUserDto) {
    return this.usersService.create(dto);
  }

  @ApiOperation({ summary: 'Activating user account' })
  @ApiOkResponse({ type: OkResponseDto })
  @ApiException(() => [NotFoundException])
  @Get('/activate/:token')
  activateAccount(@Param('token') token: string) {
    return this.usersService.activateAccount(token);
  }

  @ApiOperation({ summary: 'Request password change' })
  @ApiOkResponse({ type: OkResponseDto })
  @Post('/reset-password')
  resetPasswordRequest(@Body() dto: ResetPasswordRequestDto) {
    return this.usersService.resetPasswordRequest(dto);
  }

  @ApiOperation({ summary: 'Reset password with token' })
  @ApiOkResponse({ type: OkResponseDto })
  @ApiException(() => [NotFoundException])
  @Post('/reset-password/:token')
  resetPasswordWithToken(
    @Param('token') token: string,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.usersService.resetPasswordWithToken(token, dto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: UsersListResponse })
  @ApiException(() => [UnauthorizedException, ForbiddenException])
  @Get('/')
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(UsersListResponse)
  findAll(@Query() query: FindAllUsersQueryDto) {
    return this.usersService.findAll(
      { page: query.page, limit: query.limit },
      query.keyword,
    );
  }
}
