import {
  ConflictException,
  ImATeapotException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';

import { CoursesService } from '../courses/courses.service';
import { CourseStatusEnum } from '../courses/enum/course-status.enum';
import { PaginateQueryDto } from '../dto/paginate-query.dto';
import { Paginated } from '../interfaces/paginated.interface';
import { Coupon } from '../schemas/coupon.schema';
import { UsersService } from '../users/users.service';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Injectable()
export class CouponsService {
  private readonly logger = new Logger(CouponsService.name);

  constructor(
    @InjectModel(Coupon.name) private couponModel: Model<Coupon>,
    @InjectModel(Coupon.name)
    private couponPaginateModel: PaginateModel<Coupon>,
    private coursesService: CoursesService,
    private usersService: UsersService,
  ) {}

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponModel.findById(id);

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    return coupon;
  }

  async create(dto: CreateCouponDto): Promise<Coupon> {
    const couponWithCode = await this.couponModel.findOne({
      code: dto.code,
    });

    if (couponWithCode) {
      throw new ConflictException(`Coupon with code ${dto.code} already exist`);
    }

    const course = await this.coursesService.findOne(dto.course);

    if (course.status === CourseStatusEnum.DRAFT) {
      throw new NotFoundException('Course not found');
    }

    const coupon = new this.couponModel();

    coupon.code = dto.code;
    coupon.course = course._id;
    coupon.availableUntil = dto.availableUntil || null;
    coupon.courseAvailableDays = dto.courseAvailableDays;

    return coupon.save();
  }

  async delete(id: string): Promise<Coupon> {
    const coupon = await this.findOne(id);
    return coupon.delete();
  }

  async findAll(paginate: PaginateQueryDto): Promise<Paginated<Coupon>> {
    return this.couponPaginateModel.paginate(
      {},
      {
        limit: paginate.limit,
        page: paginate.page,
        populate: 'user course',
      },
    );
  }

  async activate(code: string, userId: string): Promise<Coupon> {
    const user = await this.usersService.findOne(userId);

    const coupon = await this.couponModel
      .findOne({
        code,
      })
      .populate('course user');

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (coupon.used) {
      throw new ImATeapotException('Coupon has been already used');
    }

    coupon.user = user._id;
    coupon.used = true;
    await coupon.save();

    await this.coursesService.addCourseToUser(
      user._id,
      coupon.course._id,
      coupon.courseAvailableDays,
    );

    return coupon;
  }
}
