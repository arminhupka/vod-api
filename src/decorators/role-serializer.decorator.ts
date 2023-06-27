import { UseInterceptors } from '@nestjs/common';

import { RoleSerializeInterceptor } from '../interceptors/role-serializer.interceptor';

export interface RoleSerializerInterface {
  // new (...args: any[]): unknown;
  adminResponse: any;
  userResponse: any;
  publicResponse: any;
}

export const RoleSerialize = (dto: RoleSerializerInterface) => {
  return UseInterceptors(new RoleSerializeInterceptor(dto));
};
