import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { ThreadsService } from './threads.service';
import { Thread } from './entities/thread.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlGuard } from 'src/auth/guards/gql-guard';
import { CreateThreadInput } from './dto/create-thread.input';
import { CurrentUser } from 'src/auth/user.decorator';
import { UserDataForToken } from 'src/auth/auth-types';
import { GetThreadsArgs } from './dto/get-threads.args';
import { OnThreadCreatedArgs } from './dto/onThreadCreated.args';

@Resolver(() => Thread)
export class ThreadsResolver {
  constructor(private readonly threadsService: ThreadsService) {}

  @Mutation(() => Thread)
  @UseGuards(GqlGuard)
  createThread(
    @Args('createThreadInput') createThreadInput: CreateThreadInput,
    @CurrentUser() user: UserDataForToken,
  ): Promise<Thread> {
    return this.threadsService.createThread(createThreadInput, user._id);
  }

  @Query(() => [Thread], { name: 'threads' })
  @UseGuards(GqlGuard)
  getThreads(
    @Args() getThredsArgs: GetThreadsArgs,
    @CurrentUser() user: UserDataForToken,
  ): Promise<Thread[]> {
    return this.threadsService.getThreads(getThredsArgs);
  }

  @Subscription(() => Thread, {
    filter: (payload, variables: OnThreadCreatedArgs, context) => {
      const userId = context.req.user._id;
      const thread: Thread = payload.onThreadCreated;

      return (
        variables.chatIds.includes(thread.chatId) &&
        userId !== thread.user._id.toHexString()
      );
    },
  })
  onThreadCreated(@Args() _onThreadCreatedArgs: OnThreadCreatedArgs) {
    return this.threadsService.onThreadCreated();
  }
}
