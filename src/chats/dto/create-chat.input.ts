import { InputType, Int, Field } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateChatInput {
  @Field()
  @Transform(({ value }) => value === 'true') // cast string to boolean
  @IsBoolean()
  isPrivate: boolean;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true }) // each element of array
  @IsNotEmpty({ each: true }) // each element of array
  @IsOptional()
  memberIds?: string[];

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional() // above validator applied only when there's data
  chatName?: string;
}
