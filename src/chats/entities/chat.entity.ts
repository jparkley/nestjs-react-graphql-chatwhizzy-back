import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/database/base.entity';

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
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
