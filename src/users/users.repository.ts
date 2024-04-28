import { BaseRepository } from 'src/common/database/base.repository';
import { User } from './entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  protected readonly logger = new Logger(User.name);

  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }
}
