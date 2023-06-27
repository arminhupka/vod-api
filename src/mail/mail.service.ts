import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { OkResponseDto } from '../dto/responses/ok.response.dto';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../schemas/order.schema';
import { Invoice } from '../schemas/invoice.schema';
import pdfGenerator from '../utils/pdf-generator';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private mailerService: MailerService,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
  ) {}

  async sendOrderConfirmationMail(
    firstName: string,
    email: string,
    order: Order,
    invoice: Invoice,
  ): Promise<OkResponseDto> {
    const pdf = await pdfGenerator(invoice, order);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Potwierdzenie zamówienia - ${order.orderId}`,
        from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        template: './user-order-success',
        attachments: [
          {
            filename: 'faktura.pdf',
            content: pdf,
            contentType: 'application/pdf',
          },
        ],
        context: {
          firstName,
          orderId: order.orderId,
          orderTotal:
            order.orderItems
              .map((o) => o.price + o.tax)
              .reduce((p, c) => (p += c)) / 100,
          vat:
            order.orderItems.map((i) => i.tax).reduce((p, c) => (p += c)) / 100,
          products: order.orderItems.map((i) => ({
            name: i.product.name,
            price: i.price / 100,
            tax: i.tax / 100,
            sum: i.price / 100 + i.tax / 100,
          })),
        },
      });

      this.logger.log(`sendOrderConfirmationMail: EMAIL SENT TO ${email}`);

      return {
        ok: true,
      };
    } catch (e) {
      this.logger.error(
        `sendOrderConfirmationMail: ERROR DURING SENDING EMAIL`,
        e,
      );
      throw new InternalServerErrorException(e);
    }
  }

  async sendOrderRefundMail(
    firstName: string,
    email: string,
  ): Promise<OkResponseDto> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Zwrot za zamówienie',
      from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      template: './user-order-refund',
      context: {
        firstName,
      },
    });

    return {
      ok: true,
    };
  }

  async userRegistrationConfirm(
    email: string,
    firstName: string,
    activationToken: string,
  ): Promise<OkResponseDto> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Dokończ rejestrację',
        from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        template: './user-registration-confirm',
        context: {
          firstName,
          activationLink: `${process.env.FRONTEND_URL}/konto/aktywacja/${activationToken}`,
        },
      });
      this.logger.log(`userRegistrationConfirm: EMAIL SENT TO ${email}`);
      return {
        ok: true,
      };
    } catch (e) {
      this.logger.error(
        `userRegistrationConfirm: ERROR DURING SENDING EMAIL`,
        e,
      );
      throw new InternalServerErrorException(e);
    }
  }

  async userResetPassword(
    email: string,
    firstName: string,
    resetPasswordToken: string,
  ): Promise<OkResponseDto> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Zmień hasło',
        from: `"${process.env.EMAIL_FROM}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        template: './user-reset-password-request',
        context: {
          firstName,
          resetPasswordLink: `${process.env.FRONTEND_URL}/konto/zresetuj-haslo/${resetPasswordToken}`,
        },
      });

      this.logger.log(`sendMail: EMAIL SENT TO ${email}`);

      return {
        ok: true,
      };
    } catch (e) {
      this.logger.error(`sendMail: ERROR DURING SENDING EMAIL`, e);
      throw new InternalServerErrorException(e);
    }
  }
}
