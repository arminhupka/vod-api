import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
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

import { CoursesService } from '../courses/courses.service';
import { AdminGetCourseDetailsResponseDto } from '../courses/dto/responses/get-course/admin-get-course-details.response.dto';
import { AdminGetCourseTopicsItemResponseDto } from '../courses/dto/responses/get-course-topics/admin-get-course-topics-item.response.dto';
import {
  AdminGetCoursesResponseDto,
  GetCoursesAdminItem,
} from '../courses/dto/responses/get-courses/admin-get-courses.response.dto';
import { CourseStatusEnum } from '../courses/enum/course-status.enum';
import { Roles } from '../decorators/roles.decorator';
import { Serialize } from '../decorators/serialize.decorator';
import { QueryDto } from '../dto/query.dto';
import { RolesGuard } from '../guards/roles.guard';
import { TopicsService } from '../topics/topics.service';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly coursesService: CoursesService,
    private readonly topicsServices: TopicsService,
  ) {}

  @ApiCookieAuth('token')
  @ApiOkResponse({ type: AdminGetCoursesResponseDto })
  @ApiOperation({ summary: 'Get all courses' })
  @ApiException(() => [UnauthorizedException])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(AdminGetCoursesResponseDto)
  @Get('/courses')
  findAllCourses(@Query() query: QueryDto) {
    return this.coursesService.getCourses(
      +query.limit,
      +query.page,
      query.orderBy,
      query.order,
      null,
      [CourseStatusEnum.DRAFT, CourseStatusEnum.PUBLISHED],
    );
  }

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Get course details' })
  @ApiException(() => [UnauthorizedException, NotFoundException])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(AdminGetCourseDetailsResponseDto)
  @Get('/courses/:id')
  getCourse(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Get course topics' })
  @ApiOkResponse({ type: AdminGetCourseTopicsItemResponseDto, isArray: true })
  @ApiException(() => [UnauthorizedException, NotFoundException])
  @Serialize(AdminGetCourseTopicsItemResponseDto)
  @Get('/courses/:id/topics')
  getCourseTopics(@Param('id') id: string) {
    return this.topicsServices.getCourseTopics(id);
  }

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Get all courses without pagination' })
  @ApiOkResponse({ type: GetCoursesAdminItem, isArray: true })
  @ApiException(() => [UnauthorizedException])
  @Serialize(GetCoursesAdminItem)
  @Get('/c')
  getAllCourses(@Query('status') status?: CourseStatusEnum) {
    return this.coursesService.getAll(status);
  }
}
