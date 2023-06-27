import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  NotFoundException,
  Param,
  Patch,
  Post,
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
import { RolesGuard } from '../guards/roles.guard';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { NewTopicDto } from './dto/new-topic.dto';
import { TopicResponseDto } from './dto/responses/topic.response.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { TopicsService } from './topics.service';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Create new course topic' })
  @ApiOkResponse({ type: TopicResponseDto })
  @ApiException(() => [ForbiddenException, UnauthorizedException])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(TopicResponseDto)
  @Post('/')
  newTopic(@Body() dto: NewTopicDto) {
    return this.topicsService.newTopic(dto);
  }

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Update course topic' })
  @ApiOkResponse({ type: TopicResponseDto })
  @ApiException(() => [
    ForbiddenException,
    UnauthorizedException,
    NotFoundException,
  ])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(TopicResponseDto)
  @Patch('/:id')
  updateTopic(@Param('id') id: string, @Body() dto: UpdateTopicDto) {
    return this.topicsService.update(id, dto);
  }

  @ApiCookieAuth('token')
  @ApiOperation({ summary: 'Delete course topic' })
  @ApiOkResponse({ type: TopicResponseDto })
  @ApiException(() => [
    ForbiddenException,
    UnauthorizedException,
    NotFoundException,
  ])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(TopicResponseDto)
  @Delete('/:id')
  deleteTopic(@Param('id') id: string) {
    return this.topicsService.delete(id);
  }
}
