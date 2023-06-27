import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { Response } from 'express';
import * as fs from 'fs';
import { FilterQuery, Model, PaginateModel } from 'mongoose';
import { join } from 'path';

import { Paginated } from '../interfaces/paginated.interface';
import { LessonsService } from '../lessons/lessons.service';
import { Course } from '../schemas/course.schema';
import { Lesson } from '../schemas/lesson.schema';
import { Topic } from '../schemas/topic.schema';
import { User } from '../schemas/user.schema';
import { TopicsService } from '../topics/topics.service';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { UsersService } from '../users/users.service';
import { addDays } from '../utils/addDays';
import { generateCertificate } from '../utils/generate-certificate';
import { NewCourseDto } from './dto/new-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseStatusEnum } from './enum/course-status.enum';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    @Inject(forwardRef(() => LessonsService))
    private lessonsService: LessonsService,
    @Inject(forwardRef(() => TopicsService))
    private topicsService: TopicsService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Course.name)
    private coursePaginateModel: PaginateModel<Course>,
  ) {}

  async create(dto: NewCourseDto): Promise<Course> {
    const course = await this.courseModel.findOne({
      name: { $regex: dto.name, $options: 'i' },
    });

    if (course) {
      throw new ConflictException(`Name ${course.name} is already in use`);
    }

    const newCourse = new this.courseModel({
      name: dto.name,
    });

    return newCourse.save();
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseModel
      .findOne({
        $or: [{ _id: isMongoId(id.toString()) ? id : undefined }, { slug: id }],
      })
      .populate('lessons topics');

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    // if (dto.salePrice && !course.price) {
    //   throw new BadRequestException(
    //     'You cannot set sale price if there is no regular price',
    //   );
    // }

    // if (dto.price !== null || dto.salePrice !== null) {
    //   if (
    //     dto.price === dto.salePrice ||
    //     dto.price === course.salePrice ||
    //     dto.salePrice === course.price
    //   ) {
    //     throw new BadRequestException('Prices cannot be equal');
    //   }
    // }

    // if (
    //   (dto.price !== null || dto.salePrice !== null) &&
    //   (dto.salePrice > dto.price || dto.salePrice > course.price)
    // ) {
    //   throw new BadRequestException(
    //     'Sale price cannot be higher than regular price',
    //   );
    // }
    //
    // if (dto.price < course.price) {
    //   throw new BadRequestException(
    //     'Regular price cannot be lower than sale price',
    //   );
    // }

    course.name = dto.name || course.name;
    course.price = !!dto.price ? dto.price : null;
    course.salePrice = !!dto.salePrice ? dto.salePrice : null;
    course.whatYouLearn = dto.whatYouLearn || course.whatYouLearn;
    course.courseIncludes = dto.courseIncludes || course.courseIncludes;
    course.status = dto.status || course.status;
    course.description = dto.description || course.description;
    course.shortDescription = dto.shortDescription || course.shortDescription;
    course.featured = dto.featured || course.featured;
    course.youtubePreview = dto.youtubePreview || course.youtubePreview;
    course.daysAvailable = dto.daysAvailable || course.daysAvailable;

    if (dto.status) {
      if (dto.status === CourseStatusEnum.DRAFT) {
        course.publishedAt = null;
      }

      if (dto.status === CourseStatusEnum.PUBLISHED) {
        course.publishedAt = new Date(Date.now());
      }
    }

    return course.save();
  }

  async delete(id: string): Promise<Course> {
    const course = await this.findOne(id);
    await this.topicsService.deleteManyByCourseId(course._id.toString());
    await this.lessonsService.deleteManyByCourseId(course._id.toString());

    return course.delete();
  }

  async getCourses(
    limit: number,
    page: number,
    orderBy: string,
    order: string,
    user: null | User,
    status?: CourseStatusEnum | CourseStatusEnum[],
  ): Promise<Paginated<Course>> {
    const sort: { [key: string]: any } = {
      publishedAt: 1,
    };

    if (orderBy) {
      delete sort.publishedAt;
    }

    if (orderBy === 'price') {
      sort.price = order || -1;
    }

    if (orderBy === 'published') {
      sort.publishedAt = order || -1;
    }

    return this.coursePaginateModel.paginate(
      {
        status:
          (status && status.length ? { $in: status } : status) ||
          CourseStatusEnum.PUBLISHED,
      },
      {
        limit: limit,
        page: page,
        sort,
        populate: ['lessons', 'topics'],
      },
    );
  }

  async getCourseLessons(id: string, user: null | User): Promise<Lesson[]> {
    const course = await this.findOne(id);

    if (
      course &&
      course.status === CourseStatusEnum.DRAFT &&
      user.role !== UserRoleEnum.ADMIN
    ) {
      throw new NotFoundException('Course not found');
    }

    return this.lessonsService.getCourseLessons(id);
  }

  async getCourseTopics(id: string, user: null | User): Promise<Topic[]> {
    const course = await this.findOne(id);

    if (
      course &&
      course.status === CourseStatusEnum.DRAFT &&
      user.role !== UserRoleEnum.ADMIN
    ) {
      throw new NotFoundException('Course not found');
    }
    return this.topicsService.getCourseTopics(id);
  }

  async getCourse(id: string, user?: User): Promise<Course> {
    const course = await this.findOne(id);

    await course.populate(['lessons', 'topics']);

    if (user.role !== UserRoleEnum.ADMIN && course.status === 'DRAFT') {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async getCoursesById(coursesIds: string[]): Promise<Course[]> {
    return this.courseModel.find({
      _id: { $in: coursesIds },
    });
  }

  async findCoursesByIds(ids: string[]): Promise<Course[]> {
    return this.courseModel.find({
      _id: { $in: ids },
    });
  }

  // async addCoursesToUser(
  //   userId: string,
  //   coursesIds: string[],
  // ): Promise<Course[]> {
  //   const user = await this.usersService.findOne(userId);
  //   const courses = await this.courseModel.find({
  //     _id: { $in: coursesIds },
  //   });
  //
  //   const foundedCourses = courses.map((c) => ({
  //     course: c._id,
  //     availableUntil: new Date(
  //       new Date(new Date().setDate(new Date().getDate() + 7)).setUTCHours(
  //         23,
  //         59,
  //         59,
  //         999,
  //       ),
  //     ),
  //   }));
  //
  //   user.courses.push(...foundedCourses);
  //
  //   await user.save();
  //
  //   return courses;
  // }

  async findMany(ids: string[]): Promise<Paginated<Course>> {
    return this.coursePaginateModel.paginate({
      _id: { $in: ids },
    });
  }

  async addCourseToUser(
    userId: string,
    courseId: string,
    courseAvailableDays: number,
  ): Promise<Course> {
    const user = await this.usersService.findOne(userId);
    this.logger.log(`addCourseToUser: USER FOUND`);
    const course = await this.findOne(courseId);
    this.logger.log(`addCourseToUser: COURSE FOUND`);
    const availableDate: null | Date =
      courseAvailableDays &&
      new Date(
        new Date(
          new Date().setDate(new Date().getDate() + courseAvailableDays),
        ).setUTCHours(23, 59, 59, 999),
      );

    const userCourse = user.courses.find((c) =>
      c.course._id.equals(course._id),
    );

    if (userCourse) {
      userCourse.availableUntil = addDays(
        userCourse.availableUntil,
        courseAvailableDays,
      );
    } else {
      user.courses.push({
        course: course._id,
        availableUntil: availableDate,
        watchedLessons: [],
      });
    }

    await user.save();

    this.logger.log(
      `addCourseToUser: ADDED COURSE ${course.name} TO USER ${user.email} - ${user._id}`,
    );

    return course;
  }

  async getAll(status?: CourseStatusEnum): Promise<Course[]> {
    const query: FilterQuery<Course> = {};

    if (status) {
      query.status = status.toUpperCase();
    }

    return this.courseModel.find(query);
  }

  async generateCertificate(res: Response, user: User, courseId: string) {
    this.logger.log(
      `generateCertificate: USER ${user.email} (${user._id}) ATTEMPTED TO GENERATE CERTIFICATE FOR COURSE ${courseId}`,
    );
    const course = await this.findOne(courseId);
    this.logger.log(`generateCertificate: FOUNDED COURSE ${course.name}`);

    let certName = '';

    if (course._id.toString() === '646874ff6c7f9ddc7ba26d39') {
      certName = 'cert_bpa.png';
    }

    if (course._id.toString() === '6466072202a50782c3769336') {
      certName = 'cert_swiatlo.png';
    }

    if (course._id.toString() === '64660169f4cfefd8675def8c') {
      certName = 'cert_podstawa.png';
    }

    if (course._id.toString() === '6465ee765daf4dd3c7fa296d') {
      certName = 'cert_lightroom.png';
    }

    const assetsFolder = join(__dirname, '../assets');

    res.set({
      'Content-Type': 'application/pdf',
      // 'Content-Disposition': `attachment; filename=CERTYFIKAT_${slugify(
      //   course.name.toUpperCase(),
      // )}.pdf`,
    });

    this.logger.log(`generateCertificate: GENERATED CERTIFICATED SUCCESSFULLY`);

    const f = fs.readFileSync(`${assetsFolder}/${certName}`);
    const test = await generateCertificate(
      f,
      `${user.billing.firstName} ${user.billing.lastName}`,
    );

    return new StreamableFile(test as Buffer);
  }
}
