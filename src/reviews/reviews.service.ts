import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CoursesService } from '../courses/courses.service';
import { Review } from '../schemas/review.schema';
import { User } from '../schemas/user.schema';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { UsersService } from '../users/users.service';
import { NewReviewDto } from './dto/new-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
  ) {}

  async createNewReview(user: User, dto: NewReviewDto): Promise<Review> {
    try {
      const c = await this.coursesService.findOne(dto.course);
      const u = await this.usersService.findOne(user._id);

      const userAlreadyCommented = await this.reviewModel.findOne({
        course: c._id,
        user: u._id,
      });

      if (userAlreadyCommented) {
        this.logger.log(
          `createNewReview: USER ${user.email} (${user._id}) TIRED COMMENT THE SAME COURSE ${c.name} (${c._id})`,
        );
        throw new ConflictException('You already commented this course');
      }

      const newReview = new this.reviewModel();

      newReview.title = dto.title;
      newReview.review = dto.review;
      newReview.course = c._id;
      newReview.user = u._id;

      await newReview.save();

      this.logger.log(
        `createNewReview: USER ${user.email} (${user._id}) POSTED NEW COMMENT IN COURSE ${c.name} (${c._id})`,
      );

      return newReview;
    } catch (e) {
      this.logger.error(
        `createNewReview: ERROR DURING CREATING NEW REVIEW`,
        '',
        e,
      );
      throw new InternalServerErrorException(e);
    }
  }

  async getCourseReviews(courseId: string): Promise<Review[]> {
    const course = await this.coursesService.findOne(courseId);
    return this.reviewModel
      .find({ course: course._id })
      .populate('course user');
  }

  async findOne(reviewId: string): Promise<Review> {
    const review = await this.reviewModel
      .findById(reviewId)
      .populate('user course');

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async deleteReview(reviewId: string, currentUser: User): Promise<Review> {
    const user = await this.usersService.findOne(currentUser._id);
    const review = await this.findOne(reviewId);

    if (user.role !== UserRoleEnum.ADMIN) {
      const reviewUserId = review.user._id.toString();
      const userId = user._id.toString();

      if (reviewUserId !== userId) {
        throw new ForbiddenException('You cannot delete this review');
      }

      return review.remove();
    }

    return review.remove();
  }

  async update(
    reviewId: string,
    userId: string,
    dto: UpdateReviewDto,
  ): Promise<Review> {
    try {
      const review = await this.findOne(reviewId);
      const user = await this.usersService.findOne(userId);

      if (!review.user._id.equals(user._id)) {
        throw new ForbiddenException('You cannot update this review');
      }

      review.title = dto.title;
      review.review = dto.review;

      return await review.save();
    } catch (e) {
      this.logger.error(`update: ERROR DURING UPDATING REVIEW ${reviewId}`);
      throw new InternalServerErrorException(e);
    }
  }
}
