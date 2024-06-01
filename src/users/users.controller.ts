import {
  Controller,
  FileTypeValidator,
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
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Post('image')
  // nestjs file interceptor to extract file from req
  @UseInterceptors(FileInterceptor('File'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: UserDataForToken,
  ) {
    return this.usersService.uploadImage(file.buffer, user._id);
  }
}
