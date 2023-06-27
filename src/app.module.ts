import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CouponsModule } from './coupons/coupons.module';
import { CoursesModule } from './courses/courses.module';
import { CronModule } from './cron/cron.module';
import { InvoicesModule } from './invoices/invoices.module';
import { LessonsModule } from './lessons/lessons.module';
import { MailModule } from './mail/mail.module';
import { OrdersModule } from './orders/orders.module';
import { PayuModule } from './payu/payu.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TopicsModule } from './topics/topics.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      connectionFactory: (connection) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
    }),
    ScheduleModule.forRoot(),
    CoursesModule,
    LessonsModule,
    UsersModule,
    AuthModule,
    TopicsModule,
    OrdersModule,
    MailModule,
    CronModule,
    UserModule,
    CouponsModule,
    PayuModule,
    UploadModule,
    AdminModule,
    ReviewsModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
