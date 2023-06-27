import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  FilterQuery,
  Model,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';

import { OrdersService } from '../orders/orders.service';
import { Invoice } from '../schemas/invoice.schema';
import { UsersService } from '../users/users.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(Invoice.name);

  constructor(
    @InjectModel(Invoice.name)
    private invoicePaginateModel: PaginateModel<Invoice>,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
  ) {}

  async createInvoice(dto: CreateInvoiceDto): Promise<Invoice> {
    const user = await this.usersService.findOne(dto.userId);
    this.logger.log(`createInvoice: FOUNDED USER ${user.email}`);
    const order = await this.ordersService.findOne(dto.orderNumber);
    this.logger.log(`createInvoice: FOUNDED ORDER ${order._id}`);

    const invoice = new this.invoiceModel();

    invoice.total = dto.total;
    invoice.subtotal = dto.subtotal;
    invoice.tax = dto.tax;
    invoice.user = user;
    invoice.paidAt = dto.paidAt;
    invoice.orderId = order;
    invoice.billing = {
      firstName: user.billing.firstName || '',
      lastName: user.billing.lastName || '',
      isCompany: user.billing.isCompany || false,
      companyName: user.billing.companyName || '',
      vatNumber: user.billing.vatNumber || '',
      city: user.billing.city || '',
      street: user.billing.street || '',
      country: user.billing.country || '',
      postCode: user.billing.postCode || '',
      companyStreet: user.billing.companyStreet || '',
      companyCountry: user.billing.companyCountry || '',
      companyPostCode: user.billing.companyPostCode || '',
      companyCity: user.billing.companyCity || '',
    };

    await invoice.save();

    this.logger.log(
      `createInvoice: CREATED INVOICE ${invoice._id} FOR ORDER ${order.orderNumber} (${order._id})`,
    );

    return invoice;
  }

  async findOneByOrder(orderId: string): Promise<Invoice> {
    return this.invoiceModel.findOne({
      orderId,
    });
  }

  async findAll(
    options: PaginateOptions,
    startDate?: string,
    endDate?: string,
    keyword?: string,
  ): Promise<PaginateResult<Invoice>> {
    const q: FilterQuery<Invoice> = {};

    if (startDate) {
      q.createdAt = {
        $gte: new Date(startDate),
      };
    }

    if (endDate) {
      q.createdAt = {
        $lte: new Date(endDate),
      };
    }

    if (endDate && startDate) {
      q.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    console.log(startDate);
    console.log(endDate);

    console.log(q);

    if (keyword) {
      await this.ordersService
        .findOneByOrderId(keyword)
        .then((o) => {
          q.orderId = o._id;
        })
        .catch(() => {
          q.orderId = new mongoose.Types.ObjectId();
        });
    }

    return this.invoicePaginateModel.paginate(q, {
      page: options.page,
      limit: options.limit,
      sort: {
        createdAt: 1,
      },
    });
  }
}
