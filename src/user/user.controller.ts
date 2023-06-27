import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { GetMeResponsesDto } from '../auth/dto/responses/get-me.responses.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Serialize } from '../decorators/serialize.decorator';
import { User } from '../schemas/user.schema';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UsersService } from '../users/users.service';
import { GetOrderResponseDto } from './dto/responses/get-order.response.dto';
import { GetOrdersResponseDto } from './dto/responses/get-orders.response.dto';
import { GetUserCoursesDto } from './dto/responses/get-user-courses.dto';
import { UserCourseResponseDto } from './dto/responses/user-course.response.dto';
import { UserCourseLessonDto } from './dto/responses/user-course-lesson.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Get current user orders' })
  @ApiOkResponse({ type: GetOrdersResponseDto })
  @ApiException(() => [UnauthorizedException])
  @UseGuards(AuthGuard('jwt'))
  @Serialize(GetOrdersResponseDto)
  @Get('/orders')
  getOrders(@CurrentUser() currentUser: User) {
    return this.userService.getOrders(currentUser);
  }

  @ApiOperation({ summary: 'Get order details' })
  @ApiOkResponse({ type: GetOrderResponseDto })
  @ApiException(() => [UnauthorizedException, NotFoundException])
  @UseGuards(AuthGuard('jwt'))
  @Serialize(GetOrderResponseDto)
  @Get('/orders/:id')
  getOrder(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.userService.getOrder(id, currentUser);
  }

  @ApiOperation({ summary: 'Get User Courses' })
  @ApiOkResponse({ type: GetUserCoursesDto, isArray: true })
  @ApiException(() => [UnauthorizedException])
  @UseGuards(AuthGuard('jwt'))
  @Serialize(GetUserCoursesDto)
  @Get('/courses')
  getCourses(@CurrentUser() currentUser: User) {
    return this.userService.getCourses(currentUser);
  }

  @ApiOperation({ summary: 'Get course details' })
  @ApiOkResponse({ type: UserCourseResponseDto })
  @ApiException(() => [UnauthorizedException, NotFoundException])
  @UseGuards(AuthGuard('jwt'))
  @Get('/courses/:id')
  @Serialize(UserCourseResponseDto)
  getCourse(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.userService.getCourse(id, currentUser);
  }

  @ApiOperation({ summary: 'Get course lesson' })
  @ApiOkResponse({ type: UserCourseLessonDto })
  @ApiException(() => [
    NotFoundException,
    ForbiddenException,
    UnauthorizedException,
  ])
  @UseGuards(AuthGuard('jwt'))
  @Get('/courses/:course/lesson/:id')
  @Serialize(UserCourseLessonDto)
  getCourseLesson(@Param('id') id: string, @CurrentUser() user: User) {
    return this.userService.getLesson(id, user);
  }

  @ApiOperation({ summary: 'Get array of watched lessons ids' })
  @ApiOkResponse({ type: String, isArray: true })
  @ApiException(() => [ForbiddenException, UnauthorizedException])
  @UseGuards(AuthGuard('jwt'))
  @Get('/watched')
  getWatchedLessons(@CurrentUser() currentUser: User) {
    return this.userService.getWatchedLessons(currentUser);
  }

  @ApiOperation({ summary: 'Update current user' })
  @ApiOkResponse({ type: GetMeResponsesDto })
  @ApiException(() => [UnauthorizedException, BadRequestException])
  @UseGuards(AuthGuard('jwt'))
  @Serialize(GetMeResponsesDto)
  @Patch('/')
  updateUser(@CurrentUser() currentUser: User, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(currentUser._id, dto);
  }
}
