import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { BaseEntity } from 'src/common/database/base.entity';

@Schema({ versionKey: false }) // don't keep track of version change
@ObjectType()
export class User extends BaseEntity {
  @Prop({ index: true, unique: true, trim: true })
  @Field()
  @IsEmail()
  email: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
