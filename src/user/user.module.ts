import { Module } from '@nestjs/common';

import { CoursesModule } from '../courses/courses.module';
import { LessonsModule } from '../lessons/lessons.module';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users/users.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [OrdersModule, CoursesModule, UsersModule, LessonsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
