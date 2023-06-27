import { UseInterceptors } from '@nestjs/common';

import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export interface ClassConstructor {
  new (...args: any[]): unknown;
}

export const Serialize = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};
