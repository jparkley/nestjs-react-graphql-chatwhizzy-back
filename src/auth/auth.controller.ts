import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalGuard } from './guards/local-guard';
import { CurrentUser } from './user.decorator';
import { Response } from 'express';
import { User } from 'src/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(LocalGuard)
  // passthrough: true
  // (for example, by injecting the response object to only set cookies/headers
  // but still leave the rest to the framework)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {}
}