import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CoursesService } from '../courses/courses.service';
import { LessonsService } from '../lessons/lessons.service';
import { Topic } from '../schemas/topic.schema';
import { NewTopicDto } from './dto/new-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<Topic>,
    @Inject(forwardRef(() => CoursesService))
    private coursesService: CoursesService,
    @Inject(forwardRef(() => LessonsService))
    private lessonsService: LessonsService,
  ) {}

  async newTopic(dto: NewTopicDto): Promise<Topic> {
    const course = await this.coursesService.findOne(dto.course);

    const newTopic = new this.topicModel();

    newTopic.title = dto.title;
    newTopic.summary = dto.summary;
    newTopic.lessons = [];
    newTopic.order = dto.order;
    newTopic.course = course._id;

    return newTopic.save();
  }

  async getCourseTopics(id: string): Promise<Topic[]> {
    const course = await this.coursesService.findOne(id);

    return this.topicModel
      .find({
        course: course._id,
      })
      .sort({ order: 1 })
      .populate({
        path: 'lessons',
        options: {
          sort: { order: 1 },
        },
      });
  }

  async findOne(id: string): Promise<Topic> {
    const topic = await this.topicModel.findById(id);

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    return topic;
  }

  async update(id: string, dto: UpdateTopicDto): Promise<Topic> {
    const topic = await this.findOne(id);

    Object.assign(topic, dto);

    return topic.save();
  }

  async delete(id: string): Promise<Topic> {
    const topic = await this.findOne(id);

    await this.topicModel.findByIdAndDelete(topic._id);
    await this.lessonsService.deleteManyLessonsByIds(
      topic.lessons.map((l) => l._id),
    );

    return topic;
  }

  async findMany(ids: string[]): Promise<Topic[]> {
    return this.topicModel.find({
      _id: { $in: ids },
    });
  }

  async deleteManyByIds(idArr: string[]): Promise<Topic[]> {
    const topics = await this.findMany(idArr);

    await this.topicModel.deleteMany({
      _id: { $in: topics.map((t) => t._id) },
    });

    return topics;
  }

  async deleteManyByCourseId(courseId: string): Promise<Topic[]> {
    const topics = await this.topicModel.find({
      course: courseId,
    });

    await this.topicModel.deleteMany({
      _id: { $in: topics.map((t) => t._id) },
    });

    return topics;
  }
}
