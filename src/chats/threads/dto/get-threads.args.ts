import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetThreadsArgs {
  @Field()
  @IsNotEmpty()
  chatId: string;
}
