import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  forwardRef,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  refs,
} from '@nestjs/swagger';

import { OptionalJwtStrategy } from '../auth/strategy/optional-jwt-strategy.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RoleSerialize } from '../decorators/role-serializer.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Serialize } from '../decorators/serialize.decorator';
import { QueryDto } from '../dto/query.dto';
import { RolesGuard } from '../guards/roles.guard';
import { ReviewDto } from '../reviews/dto/responses/review.dto';
import { ReviewsService } from '../reviews/reviews.service';
import { User } from '../schemas/user.schema';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { CoursesService } from './courses.service';
import { NewCourseDto } from './dto/new-course.dto';
import { CourseResponseDto } from './dto/responses/course.response.dto';
import { AdminGetCourseDetailsResponseDto } from './dto/responses/get-course/admin-get-course-details.response.dto';
import { GetCourseResponseDto } from './dto/responses/get-course/get-course.reponse.dto';
import { AdminGetCourseLessonsItemResponseDto } from './dto/responses/get-course-lessons/admin-get-course-lessons-item.response.dto';
import { GetCourseLessonsItemResponseDto } from './dto/responses/get-course-lessons/get-course-lessons-item.response.dto';
import { AdminGetCourseTopicsItemResponseDto } from './dto/responses/get-course-topics/admin-get-course-topics-item.response.dto';
import { GetCourseTopicsItemResponseDto } from './dto/responses/get-course-topics/get-course-topics-item.response.dto';
import { AdminGetCoursesResponseDto } from './dto/responses/get-courses/admin-get-courses.response.dto';
import { GetCoursesListResponseDto } from './dto/responses/get-courses/get-courses.response.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Response } from 'express';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    @Inject(forwardRef(() => ReviewsService))
    private readonly reviewsService: ReviewsService,
  ) {}

  @ApiOperation({ summary: 'Create new course' })
  @ApiCreatedResponse({ type: CourseResponseDto })
  @ApiException(() => [BadRequestException])
  @Post('/')
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  createCourse(@Body() dto: NewCourseDto) {
    return this.coursesService.create(dto);
  }

  @ApiOperation({ summary: 'Update course' })
  @ApiOkResponse({ type: CourseResponseDto })
  @ApiException(() => [new NotFoundException('Course not found')])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/:id')
  updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete course with all lessons' })
  @ApiOkResponse({
    description: 'Successfully remove',
    type: CourseResponseDto,
  })
  @ApiException(() => [new NotFoundException('Course not found')])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('/:id')
  deleteCourse(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }

  @ApiOperation({ summary: 'Get all courses' })
  @ApiExtraModels(AdminGetCoursesResponseDto)
  @ApiExtraModels(GetCoursesListResponseDto)
  @ApiOkResponse({
    description: 'Get all courses based on user role',
    schema: {
      oneOf: refs(AdminGetCoursesResponseDto, GetCoursesListResponseDto),
    },
  })
  @UseGuards(OptionalJwtStrategy)
  @RoleSerialize({
    adminResponse: AdminGetCoursesResponseDto,
    userResponse: GetCoursesListResponseDto,
    publicResponse: GetCoursesListResponseDto,
  })
  @Get('/')
  getCourses(@Query() query: QueryDto, @CurrentUser() user: null | User) {
    return this.coursesService.getCourses(
      +query.limit,
      +query.page,
      query.orderBy,
      query.order,
      user,
    );
  }

  @ApiOperation({ summary: 'Get course by id or slug' })
  @ApiExtraModels(AdminGetCourseDetailsResponseDto)
  @ApiExtraModels(GetCourseResponseDto)
  @ApiOkResponse({
    description: 'Get courses paginated response',
    schema: {
      oneOf: refs(AdminGetCourseDetailsResponseDto, GetCourseResponseDto),
    },
  })
  @ApiException(() => [new NotFoundException('Course not found')])
  @UseGuards(OptionalJwtStrategy)
  @RoleSerialize({
    adminResponse: AdminGetCourseDetailsResponseDto,
    userResponse: GetCourseResponseDto,
    publicResponse: GetCourseResponseDto,
  })
  @Get('/:id')
  getCourse(@Param('id') id: string, @CurrentUser() user?: User) {
    return this.coursesService.getCourse(id, user);
  }

  @ApiOperation({ summary: 'Get course lessons by id or slug' })
  @ApiExtraModels(AdminGetCourseLessonsItemResponseDto)
  @ApiExtraModels(GetCourseLessonsItemResponseDto)
  @ApiOkResponse({
    description: 'Get lessons list based on user role',
    schema: {
      oneOf: refs(
        AdminGetCourseLessonsItemResponseDto,
        GetCourseLessonsItemResponseDto,
      ),
    },
  })
  @ApiException(() => [NotFoundException])
  @UseGuards(OptionalJwtStrategy)
  @RoleSerialize({
    adminResponse: AdminGetCourseLessonsItemResponseDto,
    userResponse: GetCourseLessonsItemResponseDto,
    publicResponse: GetCourseLessonsItemResponseDto,
  })
  @Get('/:id/lessons')
  getCourseLessons(@Param('id') id: string, @CurrentUser() user: null | User) {
    return this.coursesService.getCourseLessons(id, user);
  }

  @ApiOperation({ summary: 'Get course topics by id or slug' })
  @ApiExtraModels(AdminGetCourseTopicsItemResponseDto)
  @ApiExtraModels(GetCourseTopicsItemResponseDto)
  @ApiOkResponse({
    description: 'Get course lessons based on user role',
    schema: {
      oneOf: refs(
        AdminGetCourseTopicsItemResponseDto,
        GetCourseTopicsItemResponseDto,
      ),
    },
  })
  @ApiException(() => [NotFoundException])
  @UseGuards(OptionalJwtStrategy)
  @RoleSerialize({
    adminResponse: AdminGetCourseTopicsItemResponseDto,
    userResponse: GetCourseTopicsItemResponseDto,
    publicResponse: GetCourseTopicsItemResponseDto,
  })
  @Get('/:id/topics')
  getCourseTopics(@Param('id') id: string, @CurrentUser() user: null | User) {
    return this.coursesService.getCourseTopics(id, user);
  }

  @ApiOperation({ summary: 'Get course reviews' })
  @ApiOkResponse({ type: ReviewDto, isArray: true })
  @Serialize(ReviewDto)
  @Get('/:id/reviews')
  async getCourseReviews(@Param('id') id: string) {
    return this.reviewsService.getCourseReviews(id);
  }

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Generate certificate' })
  @ApiException(() => [UnauthorizedException, ForbiddenException])
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/certificate')
  async generateCertificate(
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: User,
    @Param('id') id: string,
  ) {
    return this.coursesService.generateCertificate(res, user, id);
  }
}
