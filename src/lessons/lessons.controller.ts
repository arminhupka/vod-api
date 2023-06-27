import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
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

import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Serialize } from '../decorators/serialize.decorator';
import { OkResponseDto } from '../dto/responses/ok.response.dto';
import { RolesGuard } from '../guards/roles.guard';
import { IsMongoIdPipe } from '../pipes/is-mongo-id.pipe';
import { User } from '../schemas/user.schema';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { NewLessonDto } from './dto/new-lesson.dto';
import { LessonResponseDto } from './dto/respones/lesson.response.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonsService } from './lessons.service';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Create new lesson' })
  @ApiCreatedResponse({ type: LessonResponseDto })
  @ApiException(() => [new NotFoundException(), new BadRequestException()])
  @Serialize(LessonResponseDto)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/')
  createLesson(@Body() dto: NewLessonDto) {
    return this.lessonsService.createLesson(dto);
  }

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Update lesson' })
  @ApiCreatedResponse({ type: LessonResponseDto })
  @ApiException(() => [new NotFoundException(), new BadRequestException()])
  @Serialize(LessonResponseDto)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch('/:id')
  updateLesson(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.updateLesson(id, dto);
  }

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Delete lesson' })
  @ApiOkResponse({ type: LessonResponseDto })
  @ApiException(() => [new NotFoundException()])
  @Serialize(LessonResponseDto)
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete('/:id')
  deleteLesson(@Param('id') id: string) {
    return this.lessonsService.deleteLesson(id);
  }

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Mark lesson as watched/unwatcher' })
  @ApiOkResponse({ type: OkResponseDto })
  @ApiException(() => [NotFoundException, UnauthorizedException])
  @Roles([UserRoleEnum.ADMIN, UserRoleEnum.USER])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put('/:id/watched')
  setWatchedLesson(
    @Param('id', IsMongoIdPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.lessonsService.setWatchedLessons(id, currentUser);
  }
}
