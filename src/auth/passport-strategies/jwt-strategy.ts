import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDataForToken } from '../auth-types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // from the incoming request
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          if (request.cookies.Authentication) {
            return request.cookies.Authentication;
          }
          const authorization = request.headers.authorization;
          if (authorization && authorization.startsWith('Bearer')) {
            return authorization.substring(7, authorization.length);
          }
        },
      ]),
      secretOrKey: configService.getOrThrow('JWT_TOKEN'),
    });
  }

  // proceed to this validate method
  async validate(data: UserDataForToken) {
    return data;
  }
}
