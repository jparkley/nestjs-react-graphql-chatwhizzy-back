import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/database/base.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Thread extends BaseEntity {
  @Field()
  content: string;

  // need user object to access user info such as avatar
  @Field(() => User)
  user: User;

  @Field()
  chatId: string;

  @Field()
  createdAt: Date;
}
