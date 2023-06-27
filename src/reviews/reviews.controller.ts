import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  ConflictException,
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
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../decorators/current-user.decorator';
import { Serialize } from '../decorators/serialize.decorator';
import { IsMongoIdPipe } from '../pipes/is-mongo-id.pipe';
import { User } from '../schemas/user.schema';
import { NewReviewDto } from './dto/new-review.dto';
import { ReviewDto } from './dto/responses/review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiCookieAuth('token')
  @ApiOkResponse({ type: ReviewDto })
  @ApiException(() => [BadRequestException, ConflictException])
  @UseGuards(AuthGuard('jwt'))
  @Serialize(ReviewDto)
  @Post('/')
  newReview(@CurrentUser() user: User, @Body() dto: NewReviewDto) {
    return this.reviewsService.createNewReview(user, dto);
  }

  @ApiCookieAuth('token')
  @ApiOkResponse({ type: ReviewDto })
  @ApiException(() => [
    UnauthorizedException,
    NotFoundException,
    ForbiddenException,
  ])
  @UseGuards(AuthGuard('jwt'))
  @Serialize(ReviewDto)
  @Delete('/:id')
  deleteReview(
    @Param('id', IsMongoIdPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.reviewsService.deleteReview(id, user);
  }

  @ApiCookieAuth('token')
  @ApiOkResponse({ type: ReviewDto })
  @ApiException(() => [
    UnauthorizedException,
    NotFoundException,
    ForbiddenException,
  ])
  @UseGuards(AuthGuard('jwt'))
  @Serialize(ReviewDto)
  @Patch('/:id')
  updateReview(
    @Param('id', IsMongoIdPipe) id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, user._id, dto);
  }
}
