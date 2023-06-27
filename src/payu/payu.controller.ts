import { Body, Controller, Ip, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { User } from '../schemas/user.schema';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { PayuService } from './payu.service';

@Controller('payu')
export class PayuController {
  constructor(private readonly payuService: PayuService) {}

  @Roles([UserRoleEnum.ADMIN, UserRoleEnum.USER])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('/create')
  create(
    @Body() dto: CreateOrderDto,
    @CurrentUser() user: User,
    @Ip() ip: string,
  ) {
    return this.payuService.createOrder(dto, user._id, ip);
  }

  @Post('/webhook/:id')
  webhook(@Param('id') id: string, @Body() orderData: any) {
    return this.payuService.catchPayment(id, orderData.order.status);
  }
}
