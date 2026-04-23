import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { validateToken, checkUserPermission } from '../../utils/module';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || authHeader.includes('Noauth')) {
      return true; 
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        message: 'توکن نامعتبر است',
        error: 'Invalid token',
      });
    }

    const token = authHeader.split(' ')[1];
    
    const validationResult = await validateToken(token);

    if (validationResult.code === 0) {
      throw new UnauthorizedException({
        message: validationResult.message,
        error: 'Unauthorized access',
      });
    }

    const routePath = request.url;
    const accessResult = await checkUserPermission(
      routePath,
      validationResult.data.accessPerms,
    );

    if (accessResult.code === 0) {
      throw new ForbiddenException({
        message: accessResult.message,
        error: 'Forbidden access',
      });
    }

    request['userData'] = {
      userId: validationResult.data.userId,
      accessPerms: validationResult.data.accessPerms,
    };

    return true;
  }
}