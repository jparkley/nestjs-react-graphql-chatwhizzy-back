import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDataForToken } from 'src/auth/auth-types';
import { JwtGuard } from 'src/auth/guards/jwt-guard';
import { CurrentUser } from 'src/auth/user.decorator';

@Controller('users')
export class UsersController {
  @UseGuards(JwtGuard)
  @Post('image')
  // nestjs file interceptor to extract file from req
  @UseInterceptors(FileInterceptor('File'))
  async uploadProfileImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 3000 })],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: UserDataForToken,
  ) {}
}
