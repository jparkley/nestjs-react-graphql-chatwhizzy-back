import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class OnThreadCreatedArgs {
  @Field()
  @IsNotEmpty()
  chatId: string;
}
