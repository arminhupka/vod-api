import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import * as easyinvoice from 'easyinvoice';
import { Response } from 'express';
import mongoose, { FilterQuery, Model, PaginateModel } from 'mongoose';

import { CoursesService } from '../courses/courses.service';
import { CourseStatusEnum } from '../courses/enum/course-status.enum';
import { Paginated } from '../interfaces/paginated.interface';
import { InvoicesService } from '../invoices/invoices.service';
import { Order, OrderItem } from '../schemas/order.schema';
import { User } from '../schemas/user.schema';
import { UsersService } from '../users/users.service';
import { calculateTax } from '../utils/calculateTax';
import { NewOrderDto } from './dto/new-order.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { OrderStatusEnum } from './enums/order-status.enum';
import generateInvoicePdf from '../utils/pdf-generator';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const orderid = require('order-id')('key');

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private ordersModel: Model<Order>,
    @InjectModel(Order.name)
    private orderPaginateModel: PaginateModel<Order>,
    @Inject(forwardRef(() => CoursesService))
    private readonly coursesService: CoursesService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => InvoicesService))
    private readonly invoicesService: InvoicesService,
  ) {}

  async newOrder(dto: NewOrderDto, user: User): Promise<Order> {
    const currentUser = await this.usersService.findOne(user._id);
    const newOrder = new this.ordersModel();

    const courses = await this.coursesService.getCoursesById(dto.orderItems);
    const coursesObj = courses.filter(
      (c) => c.status === CourseStatusEnum.PUBLISHED,
    );

    const id = orderid.generate();

    const orderItems: OrderItem[] = await Promise.all(
      coursesObj.map(async (c) => {
        const netPrice = calculateTax(c.salePrice || c.price);
        const tax = (c.salePrice || c.price) - netPrice;

        return {
          product: c._id,
          price: netPrice,
          tax,
        };
      }),
    );

    newOrder.status = OrderStatusEnum.NEW;
    newOrder.user = currentUser;
    newOrder.orderId = orderid.getTime(id);
    newOrder.orderItems = orderItems;
    newOrder.tax_rate = Number(process.env.TAX_RATE);

    newOrder.billing.firstName = currentUser.billing.firstName;
    newOrder.billing.lastName = currentUser.billing.lastName;
    newOrder.billing.isCompany = currentUser.billing.isCompany;
    newOrder.billing.companyName = currentUser.billing.companyName;
    newOrder.billing.vatNumber = currentUser.billing.vatNumber;
    newOrder.billing.city = currentUser.billing.city;
    newOrder.billing.street = currentUser.billing.street;
    newOrder.billing.country = currentUser.billing.country;
    newOrder.billing.postCode = currentUser.billing.postCode;

    newOrder.billing.companyStreet = currentUser.billing.companyStreet;
    newOrder.billing.companyCity = currentUser.billing.companyCity;
    newOrder.billing.companyCountry = currentUser.billing.companyCountry;
    newOrder.billing.companyPostCode = currentUser.billing.companyPostCode;

    newOrder.billing.isCompany = !!currentUser.billing.vatNumber;

    await newOrder.populate(['orderItems.product']);

    await newOrder.save();

    return newOrder;
  }

  async gerOrder(id: string): Promise<Order> {
    const order = await this.ordersModel
      .findById(id)
      .populate('orderItems.product user');

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async changeOrderStatusByOrderId(
    orderId: string,
    status: OrderStatusEnum,
  ): Promise<Order> {
    const order = await this.ordersModel.findOne({
      orderId,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    return order.save();
  }

  async addPaymentIntent(id: string, pi: string): Promise<Order> {
    const order = await this.ordersModel.findById({
      _id: id,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.stripePaymentIntent = pi;
    return order.save();
  }

  async setOrderStatusByPaymentIntent(
    paymentIntent: string,
    status: OrderStatusEnum,
  ): Promise<Order> {
    const order = await this.ordersModel.findOne({
      stripePaymentIntent: paymentIntent,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;

    return order.save();
  }

  async getOrders(query: QueryOrdersDto): Promise<Paginated<Order>> {
    const q: FilterQuery<Order> = {};

    if (query.orderId) {
      q.orderId = query.orderId;
    }

    if (query.email) {
      await this.usersService
        .findByEmail(query.email)
        .then((u) => {
          q.user = u._id;
        })
        .catch(() => null);
    }

    if (query.status) {
      q.status = query.status;
    }

    return this.orderPaginateModel.paginate(q, {
      limit: +query.limit,
      page: +query.page,
      populate: ['user'],
      sort: {
        orderNumber: -1,
      },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersModel
      .findOne({
        $or: [{ _id: isMongoId(id) ? id : null }, { orderId: id }],
      })
      .populate('user')
      .populate('orderItems.product');

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findOneByOrderId(id: string): Promise<Order> {
    const order = await this.ordersModel
      .findOne({
        orderId: id,
      })
      .populate('orderItems.product');

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async setPaidDate(id: string, date: Date): Promise<Order> {
    const order = await this.findOne(id);
    order.paidAt = date;
    return order.save();
  }

  async findByPaymentIntent(paymentIntent: string): Promise<Order> {
    const order = await this.ordersModel
      .findOne({
        stripePaymentIntent: paymentIntent,
      })
      .populate('user');

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getOrdersByUser(userId: string): Promise<Paginated<Order>> {
    return this.orderPaginateModel.paginate(
      {
        user: userId,
      },
      {
        sort: {
          createdAt: -1,
        },
      },
    );
  }

  async createInvoicePDF2(res: Response, orderId: string) {
    const order = await this.findOne(orderId);
    const inv = await this.invoicesService.findOneByOrder(order._id);

    const invoice = await generateInvoicePdf(inv, order);

    res.set({
      'Content-Type': 'application/pdf',
      // 'Content-Disposition': `attachment; filename=invoice.pdf`,
    });

    return new StreamableFile(invoice as Buffer);
  }
}
