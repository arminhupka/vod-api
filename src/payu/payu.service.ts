import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AxiosError } from 'axios';

import { CoursesService } from '../courses/courses.service';
import { InvoicesService } from '../invoices/invoices.service';
import { MailService } from '../mail/mail.service';
import { OrderStatusEnum } from '../orders/enums/order-status.enum';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';

export interface IPayuLogin {
  access_token: string;
  token_type: string;
  expires_in: number;
  grant_type: string;
}

export enum PayuPaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

@Injectable()
export class PayuService {
  private readonly logger = new Logger(PayuService.name);

  constructor(
    private readonly httpService: HttpService,
    private coursesService: CoursesService,
    private ordersService: OrdersService,
    private usersService: UsersService,
    private mailService: MailService,
    private invoicesService: InvoicesService,
  ) {}

  async getToken(): Promise<string> {
    try {
      const { data } = await this.httpService.axiosRef.post<IPayuLogin>(
        `${process.env.PAYU_URL}/pl/standard/user/oauth/authorize`,
        {},
        {
          params: {
            grant_type: 'client_credentials',
            client_id: process.env.PAYU_CLIENT_ID,
            client_secret: process.env.PAYU_CLIENT_SECRET,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      this.logger.log('getToken: GENERATED NEW PAYU AUTH TOKEN - SUCCESS');
      return data.access_token;
    } catch (err) {
      this.logger.warn('getToken: GENERATED NEW PAYU AUTH TOKEN - FAILED', err);
      throw new BadGatewayException(err);
    }
  }

  async createOrder(dto: CreateOrderDto, userId: string, ip: string) {
    const user = await this.usersService.findOne(userId);
    const courses = await this.coursesService.findMany(dto.products);
    const order = await this.ordersService.newOrder(
      {
        orderItems: courses.docs.map((c) => c._id),
      },
      user,
    );

    const taxes = order.orderItems.map((c) => c.tax).reduce((p, c) => (p += c));
    const subtotal = order.orderItems
      .map((c) => c.price)
      .reduce((p, c) => (p += c));
    const total = taxes + subtotal;

    const token = await this.getToken();

    try {
      await this.httpService.axiosRef.post(
        `${process.env.PAYU_URL}/api/v2_1/orders`,
        {
          notifyUrl: `${process.env.BACKEND_URL}/payu/webhook/${order.orderId}/`,
          continueUrl: `${process.env.FRONTEND_URL}/zamowienie/${order.orderId}`,
          customerIp: ip,
          merchantPosId: process.env.PAYU_CLIENT_ID,
          description: process.env.EMAIL_FROM,
          currencyCode: 'PLN',
          extOrderId: order.orderId,
          totalAmount: total,
          buyer: {
            email: order.user.email,
            phone: '654111654',
            firstName: order.user.billing.firstName,
            lastName: order.user.billing.lastName,
            language: 'pl',
          },
          products: order.orderItems.map((c) => ({
            name: c.product.name,
            unitPrice: c.price,
            quantity: 1,
          })),
        },
        {
          maxRedirects: 0,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (err) {
      const error = err as AxiosError;

      this.logger.log(
        `createOrder: USER ${user.email} (${user._id}) CREATED PAYU LINK - SUCCESS`,
      );

      if (error.response?.status !== 302) {
        this.logger.error(
          `createOrder: USER ${user.email} CREATED PAYU LINK - FAILED`,
          error,
        );
        throw new BadGatewayException('PayU Error');
      }

      return error.response.headers['location'];
    }
  }

  async catchPayment(id: string, status: PayuPaymentStatus) {
    try {
      const order = await this.ordersService.findOneByOrderId(id);
      if (order.status !== OrderStatusEnum.COMPLETE) {
        if (status === PayuPaymentStatus.PENDING) {
          this.logger.log(
            `catchPayment: PAYU CAPTURE: ORDER ${id} - ${status.toUpperCase()}`,
          );
          order.status = OrderStatusEnum.IN_PROGRESS;
          await order.save();
        }

        if (status === PayuPaymentStatus.CANCELED) {
          this.logger.log(
            `catchPayment: PAYU CAPTURE: ORDER ${id} - ${status.toUpperCase()}`,
          );
          order.status = OrderStatusEnum.CANCELED;
          await order.save();
        }

        if (status === PayuPaymentStatus.COMPLETED) {
          this.logger.log(
            `catchPayment: PAYU CAPTURE: ORDER ${id} - ${status.toUpperCase()}`,
          );
          order.status = OrderStatusEnum.COMPLETE;

          this.logger.log(
            `catchPayment: PAYU CAPTURE: ORDER ${id} - CHANGED STATUS TO ${order.status}`,
          );

          await order.save();

          this.logger.log(`catchPayment: PAYU CAPTURE: ORDER ${id} - SAVED`);

          const user = await this.usersService.findOne(order.user._id);
          this.logger.log(
            `catchPayment: PAYU CAPTURE: ORDER ${id} - FOUNDED USER`,
          );

          order.paidAt = new Date();
          await order.save();
          this.logger.log(
            `catchPayment: PAYU CAPTURE: ORDER ${id} - SAVED ORDER`,
          );

          const subtotal = order.orderItems
            .map((item) => item.price)
            .reduce((prev, current) => (prev += current));

          const tax = order.orderItems
            .map((item) => item.tax)
            .reduce((prev, curr) => (prev += curr));

          const inv = await this.invoicesService.createInvoice({
            total: subtotal + tax,
            subtotal,
            tax,
            paidAt: new Date(Date.now()),
            userId: order.user._id,
            orderNumber: order.orderId,
          });

          for (const item of order.orderItems) {
            await this.coursesService.addCourseToUser(
              user._id,
              item.product._id,
              item.product.daysAvailable,
            );
          }

          await this.mailService.sendOrderConfirmationMail(
            user.billing.firstName,
            user.email,
            order,
            inv,
          );
        }
      }
    } catch (e) {
      this.logger.warn(`catchPayment: ORDER ${id} NOT FOUND`, e);
      throw new NotFoundException(`Order ${id} not found`);
    }

    return {
      ok: true,
    };
  }
}
