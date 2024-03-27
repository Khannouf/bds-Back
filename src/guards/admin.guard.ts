import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoleEnum } from 'src/enums/user-role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();

    return request.user?.roles === UserRoleEnum.ADMIN;
  }
}
