import { ApiException } from '@nanogiants/nestjs-swagger-api-exception-decorator';
import {
  Controller,
  ForbiddenException,
  Get,
  Query,
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

import { Roles } from '../decorators/roles.decorator';
import { Serialize } from '../decorators/serialize.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';
import { FindAllInvoicesQueryDto } from './dto/find-all-invoices.query.dto';
import { FindAllInvoicesResponseDto } from './dto/responses/find-all-invoices.response.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @ApiOperation({ summary: 'Fetch all invoices' })
  @ApiCookieAuth('auth')
  @ApiOkResponse({ type: FindAllInvoicesResponseDto })
  @ApiException(() => [UnauthorizedException, ForbiddenException])
  @Roles([UserRoleEnum.ADMIN])
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('/')
  @Serialize(FindAllInvoicesResponseDto)
  findAll(@Query() query: FindAllInvoicesQueryDto) {
    return this.invoicesService.findAll(
      {
        page: query.page,
        limit: query.limit,
      },
      query.startDate,
      query.endDate,
      query.keyword,
    );
  }
}
