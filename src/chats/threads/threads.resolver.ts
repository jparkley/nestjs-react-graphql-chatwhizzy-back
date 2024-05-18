import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ThreadsService } from './threads.service';
import { Thread } from './entities/thread.entity';
import { UseGuards } from '@nestjs/common';
import { GqlGuard } from 'src/auth/guards/gql-guard';
import { CreateThreadInput } from './dto/create-thread.input';
import { CurrentUser } from 'src/auth/user.decorator';
import { UserDataForToken } from 'src/auth/auth-types';
import { GetThreadsArgs } from './dto/get-threads.args';

@Resolver(() => Thread)
export class ThreadsResolver {
  constructor(private readonly threadsService: ThreadsService) {}

  @Mutation(() => Thread)
  @UseGuards(GqlGuard)
  createThread(
    @Args('createThreadInput') createThreadInput: CreateThreadInput,
    @CurrentUser() user: UserDataForToken,
  ) {
    return this.threadsService.createThread(createThreadInput, user._id);
  }

  @Query(() => [Thread], { name: 'threads' })
  @UseGuards(GqlGuard)
  getThreads(
    @Args() getThredsArgs: GetThreadsArgs,
    @CurrentUser() user: UserDataForToken,
  ) {
    return this.threadsService.getThreads(getThredsArgs, user._id);
  }
}
