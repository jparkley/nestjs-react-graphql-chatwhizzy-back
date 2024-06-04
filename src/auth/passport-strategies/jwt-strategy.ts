import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDataForToken } from '../auth-types';
import { getJwtAuthorizationHeader } from '../jwt-header';

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

          return getJwtAuthorizationHeader(request.headers.authorization);
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
