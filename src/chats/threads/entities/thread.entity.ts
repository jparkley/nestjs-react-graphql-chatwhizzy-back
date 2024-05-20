import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/database/base.entity';

@Schema()
@ObjectType()
export class Thread extends BaseEntity {
  @Prop()
  @Field()
  content: string;

  @Prop()
  @Field()
  userId: string;

  @Prop()
  @Field()
  createdAt: Date;

  @Prop()
  @Field()
  chatId: string;
}
