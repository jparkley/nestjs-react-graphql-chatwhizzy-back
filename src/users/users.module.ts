import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { UserRepository } from './users.repository';
import { DatabaseModule } from 'src/common/database/database.module';
import { UserEntity, UserSchema } from './entities/user.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([
      {
        name: UserEntity.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersResolver, UsersService, UserRepository],
})
export class UsersModule {}
