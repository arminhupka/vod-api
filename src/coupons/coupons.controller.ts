import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Serialize } from '../decorators/serialize.decorator';
import { PaginateQueryDto } from '../dto/paginate-query.dto';
import { RolesGuard } from '../guards/roles.guard';
import { IsMongoIdPipe } from '../pipes/is-mongo-id.pipe';
import { User } from '../schemas/user.schema';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { CouponsService } from './coupons.service';
import { ActivateCourseDto } from './dto/activate-course.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponResponseDto } from './dto/response/coupon.response.dto';
import { CouponsListResponseDto } from './dto/response/coupons-list.response.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @ApiOperation({ summary: 'Creating new coupon' })
  @ApiBearerAuth('token')
  @ApiOkResponse({ type: CouponResponseDto })
  @ApiException(() => [UnauthorizedException, BadRequestException])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(CouponResponseDto)
  @Post('/')
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @ApiOperation({ summary: 'Delete coupon' })
  @ApiBearerAuth('auth')
  @ApiOkResponse({ type: CouponResponseDto })
  @ApiException(() => [UnauthorizedException, BadRequestException])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(CouponResponseDto)
  @Delete('/:id')
  delete(@Param('id', new IsMongoIdPipe()) id: string) {
    return this.couponsService.delete(id);
  }

  @ApiOperation({ summary: 'Delete coupon' })
  @ApiBearerAuth('auth')
  @ApiOkResponse({ type: CouponsListResponseDto })
  @ApiException(() => [UnauthorizedException, BadRequestException])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(CouponsListResponseDto)
  @Get('/')
  findAll(@Query() paginateQuery: PaginateQueryDto) {
    return this.couponsService.findAll(paginateQuery);
  }

  @ApiOperation({ summary: 'Assigning course to user by providing code' })
  @ApiBearerAuth('token')
  @ApiOkResponse({ type: CouponResponseDto })
  @ApiException(() => [UnauthorizedException, NotFoundException])
  @Roles([UserRoleEnum.ADMIN, UserRoleEnum.USER])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Serialize(CouponResponseDto)
  @Post('/activate')
  activate(@Body() dto: ActivateCourseDto, @CurrentUser() user: User) {
    return this.couponsService.activate(dto.code, user._id);
  }
}
