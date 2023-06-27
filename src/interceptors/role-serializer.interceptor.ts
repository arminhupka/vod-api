import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RoleSerializerInterface } from '../decorators/role-serializer.decorator';
import { User } from '../schemas/user.schema';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';

export class RoleSerializeInterceptor implements NestInterceptor {
  constructor(private dto: RoleSerializerInterface) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    // Run something before request
    // console.log('Im running before the handler', context);

    const req = context.switchToHttp().getRequest();
    const user: User | null = req.user;

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        // console.log('Running before response is sent out', data);
        if (user.role === UserRoleEnum.ADMIN) {
          return plainToInstance(this.dto.adminResponse, data, {
            excludeExtraneousValues: true,
          });
        }

        if (user.role === UserRoleEnum.USER) {
          return plainToInstance(this.dto.userResponse, data, {
            excludeExtraneousValues: true,
          });
        }

        if (!user) {
          return plainToInstance(this.dto.publicResponse, data, {
            excludeExtraneousValues: true,
          });
        }
      }),
    );
  }
}
