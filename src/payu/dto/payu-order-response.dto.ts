import { PayuPaymentStatus } from '../payu.service';

export class PayuOrderResponseDto {
  order: {
    status: PayuPaymentStatus;
    localReceiptDateTime: string;
  };
}
