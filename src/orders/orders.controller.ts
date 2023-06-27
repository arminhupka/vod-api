import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Header,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Serialize } from '../decorators/serialize.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { IsMongoIdPipe } from '../pipes/is-mongo-id.pipe';
import { User } from '../schemas/user.schema';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { NewOrderDto } from './dto/new-order.dto';
import { OrderDto } from './dto/order.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { GetAdminOrdersResponseDto } from './dto/responses/get-admin-orders-response.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create new order' })
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: OrderDto })
  @ApiException(() => [UnauthorizedException])
  @Roles([UserRoleEnum.ADMIN, UserRoleEnum.USER])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(OrderDto)
  @Post('/')
  newOrder(@Body() dto: NewOrderDto, @CurrentUser() user: User) {
    return this.ordersService.newOrder(dto, user);
  }

  @ApiOperation({ summary: 'Get order details' })
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: OrderDto })
  @ApiException(() => [UnauthorizedException])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(OrderDto)
  @Get('/:id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.gerOrder(id);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiCookieAuth('token')
  @ApiOkResponse({ type: GetAdminOrdersResponseDto })
  @ApiException(() => [UnauthorizedException])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(GetAdminOrdersResponseDto)
  @Get('/')
  getOrders(@Query() query: QueryOrdersDto) {
    return this.ordersService.getOrders(query);
  }

  @ApiOperation({ summary: 'Download invoice' })
  @ApiCookieAuth('token')
  @ApiException(() => [
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
  ])
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id/invoice')
  getInvoice(
    @Res({ passthrough: true }) res: Response,
    @Param('id', IsMongoIdPipe) id: string,
  ) {
    return this.ordersService.createInvoicePDF2(res, id);
  }
}
