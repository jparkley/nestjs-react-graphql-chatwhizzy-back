import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { User } from 'src/users/entities/user.entity';
import { UserDataForToken } from './auth-types';
import { getJwtAuthorizationHeader } from './jwt-header';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRATION'),
    );

    const data: UserDataForToken = {
      ...user,
      _id: user._id.toHexString(),
    };

    const token = this.jwtService.sign(data);

    response.cookie('Authentication', token, {
      httpOnly: true, // only during http requests
      expires,
    });

    return token;
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }

  verifyWsJWT(request: Request, connectionParams: any = {}): UserDataForToken {
    const cookies: string[] = request.headers.cookie?.split('; ');
    const authCookie = cookies?.find((cookie) =>
      cookie.includes('Authentication'),
    );
    const jwt = authCookie?.split('Authentication=')[1];
    return this.jwtService.verify(
      jwt || getJwtAuthorizationHeader(connectionParams.token),
    );
  }
}
