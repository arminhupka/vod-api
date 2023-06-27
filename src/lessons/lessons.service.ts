import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CoursesService } from '../courses/courses.service';
import { OkResponseDto } from '../dto/responses/ok.response.dto';
import { Lesson } from '../schemas/lesson.schema';
import { User } from '../schemas/user.schema';
import { TopicsService } from '../topics/topics.service';
import { UsersService } from '../users/users.service';
import { NewLessonDto } from './dto/new-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @Inject(forwardRef(() => CoursesService))
    private coursesService: CoursesService,
    @Inject(forwardRef(() => TopicsService))
    private topicsService: TopicsService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
  ) {}

  async createLesson(dto: NewLessonDto): Promise<Lesson> {
    const course = await this.coursesService.findOne(dto.course);
    const topic = await this.topicsService.findOne(dto.topic);

    const lesson = new this.lessonModel({
      title: dto.title,
      description: dto.description,
      order: dto.order,
      course: course._id,
      topic: topic._id,
      videoLink: dto.videoLink,
    });

    await lesson.save();

    topic.lessons.push(lesson);
    await topic.save();

    return lesson;
  }

  async findOne(id: string): Promise<Lesson> {
    const lesson = await this.lessonModel.findById(id);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async deleteLesson(id: string): Promise<Lesson> {
    const lesson = await this.findOne(id);
    return lesson.remove();
  }

  async deleteManyByCourseId(id: string): Promise<any> {
    const course = await this.coursesService.findOne(id);
    return this.lessonModel.deleteMany({
      course,
    });
  }

  async updateLesson(id: string, dto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findOne(id);

    lesson.title = dto.title || lesson.title;
    lesson.description = dto.description || lesson.description;
    lesson.videoLink = dto.videoLink || lesson.videoLink;

    return lesson.save();
  }

  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    const course = await this.coursesService.findOne(courseId);

    return this.lessonModel
      .find({
        course: course._id,
      })
      .populate('attachments');
  }

  async findMany(idArr: string[]): Promise<Lesson[]> {
    return this.lessonModel.find({
      _id: { $in: idArr },
    });
  }

  async deleteManyLessonsByIds(idArr: string[]): Promise<Lesson[]> {
    const lessons = await this.findMany(idArr);
    await this.lessonModel.deleteMany({
      _id: { $in: lessons.map((l) => l._id) },
    });
    return lessons;
  }

  async setWatchedLessons(
    id: string,
    currentUser: User,
  ): Promise<OkResponseDto> {
    const lesson = await this.findOne(id);
    const user = await this.usersService.findOne(currentUser._id);

    const userHasCourse = user.courses.find((c) =>
      c.course._id.equals(lesson.course._id),
    );

    const userHasLesson = userHasCourse.watchedLessons.find((l) =>
      l._id.equals(lesson._id),
    );

    if (userHasLesson) {
      userHasCourse.watchedLessons = userHasCourse.watchedLessons.filter(
        (l) => !l._id.equals(lesson._id),
      );
      await user.save();
    } else {
      userHasCourse.watchedLessons.push(lesson._id);
      await user.save();
    }

    return {
      ok: true,
    };
  }
}
