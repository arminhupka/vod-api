import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  MailerModule,
  MailerOptions,
  MailerOptionsFactory,
} from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { OrdersModule } from '../orders/orders.module';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

class MailerConfig implements MailerOptionsFactory {
  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: {
        host: 'prokitz.atthost24.pl',
        secure: true,
        port: 465,
        auth: {
          user: 'demo@prokitz.atthost24.pl',
          pass: 'Kurasan!4991768',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    };
  }
}

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfig,
    }),
    forwardRef(() => OrdersModule),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
