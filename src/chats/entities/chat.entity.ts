import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/database/base.entity';
import { Thread } from '../threads/entities/thread.entity';

// graphql: @Objectype, @Field
@ObjectType()
export class Chat extends BaseEntity {
  @Field()
  chatName: string;

  @Field(() => Thread, { nullable: true }) // no thread for newly created chat
  latestThread?: Thread;
}
