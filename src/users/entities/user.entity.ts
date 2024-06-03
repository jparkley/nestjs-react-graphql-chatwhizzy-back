import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/database/base.entity';

@ObjectType()
export class User extends BaseEntity {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  imageUrl: string;
}
