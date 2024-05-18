import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/database/base.entity';
import { Thread } from '../threads/entities/thread.entity';

// mongoose: @Schema, @Prop
// graphql: @Objectype, @Field
@Schema({ versionKey: false })
@ObjectType()
export class Chat extends BaseEntity {
  @Prop()
  @Field()
  creatorId: string;

  @Prop()
  @Field()
  isPrivate: boolean;

  @Prop([String])
  @Field(() => [String])
  memberIds: string[];

  @Prop()
  @Field({ nullable: true })
  chatName?: string;

  @Prop([Thread])
  threads: Thread[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
