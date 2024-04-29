import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';

// LocalStrategy default name: 'local'
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    try {
      // attach return value to the user property on the request
      return await this.userService.validateUser(email, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
