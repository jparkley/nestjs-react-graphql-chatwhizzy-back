import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { ThreadsService } from './threads.service';
import { Thread } from './entities/thread.entity';
import { Inject, UseGuards } from '@nestjs/common';
import { GqlGuard } from 'src/auth/guards/gql-guard';
import { CreateThreadInput } from './dto/create-thread.input';
import { CurrentUser } from 'src/auth/user.decorator';
import { UserDataForToken } from 'src/auth/auth-types';
import { GetThreadsArgs } from './dto/get-threads.args';
import { PubSub } from 'graphql-subscriptions';
import { TOKEN_PUB_SUB, TRIGGER_ON_THREAD_CREATED } from 'src/constants';
import { OnThreadCreatedArgs } from './dto/onThreadCreated.args';

@Resolver(() => Thread)
export class ThreadsResolver {
  constructor(
    private readonly threadsService: ThreadsService,
    @Inject(TOKEN_PUB_SUB) private readonly pubSub: PubSub,
  ) {}

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

  @Subscription(() => Thread, {
    filter: (payload, variables) => {
      return payload.onThreadCreated.chatId === variables.chatId;
    },
  })
  onThreadCreated(@Args() _onThreadCreatedArgs: OnThreadCreatedArgs) {
    return this.pubSub.asyncIterator(TRIGGER_ON_THREAD_CREATED);
  }
}
