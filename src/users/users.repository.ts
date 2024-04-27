import { BaseRepository } from 'src/common/database/base.repository';
import { UserEntity } from './entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  protected readonly logger = new Logger(UserEntity.name);

  constructor(@InjectModel(UserEntity.name) userModel: Model<UserEntity>) {
    super(userModel);
  }
}
