import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { CoursesService } from '../courses/courses.service';
import { Paginated } from '../interfaces/paginated.interface';
import { LessonsService } from '../lessons/lessons.service';
import { OrdersService } from '../orders/orders.service';
import { Course } from '../schemas/course.schema';
import { Order } from '../schemas/order.schema';
import { User, UserCourse } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private ordersService: OrdersService,
    private coursesService: CoursesService,
    private usersServices: UsersService,
    private lessonsService: LessonsService,
  ) {}

  async getOrders(currentUser: User): Promise<Paginated<Order>> {
    return this.ordersService.getOrdersByUser(currentUser._id);
  }

  async getOrder(orderId: string, currentUser: User): Promise<Order> {
    const order = await this.ordersService.findOne(orderId);

    if (!currentUser.equals(order.user)) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getCourses(currentUser: User): Promise<UserCourse[]> {
    const user = await this.usersServices.findOne(currentUser._id);
    return user.courses;
  }

  async getCourse(id: string, currentUser: User): Promise<Course> {
    const course = await this.coursesService.findOne(id);
    const user = await this.usersServices.findOne(currentUser._id);

    if (!user.courses.find((c) => c.course._id.equals(course._id))) {
      this.logger.warn(
        `getCourse: USER ${user.email} (${user._id}) TRIED ACCESS TO NOT OWNED COURSE`,
      );
      throw new ForbiddenException("You don't have access");
    }

    this.logger.log(
      `getCourse: USER ${user.email} (${user._id}) FETCHED WATCHED LESSONS`,
    );

    return course;
  }

  async getLesson(id: string, currentUser: User) {
    return this.lessonsService.findOne(id);
  }

  async getWatchedLessons(user: User): Promise<string[]> {
    const currentUser = await this.usersServices.findOne(user._id.toString());
    const lessons = currentUser.courses.map((c) => c.watchedLessons).flat();
    const mappedLessons = lessons.map((l) => l._id);

    this.logger.log(
      `getWatchedLessons: USER ${user.email} (${user._id}) FETCHED WATCHED LESSONS`,
    );

    return mappedLessons;
  }
}
