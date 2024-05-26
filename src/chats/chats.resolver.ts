import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { UseGuards } from '@nestjs/common';
import { GqlGuard } from 'src/auth/guards/gql-guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { UserDataForToken } from 'src/auth/auth-types';

@Resolver(() => Chat)
export class ChatsResolver {
  constructor(private readonly chatsService: ChatsService) {}

  @UseGuards(GqlGuard)
  @Mutation(() => Chat)
  async createChat(
    @Args('createChatInput') createChatInput: CreateChatInput,
    @CurrentUser() user: UserDataForToken,
  ): Promise<Chat> {
    return this.chatsService.create(createChatInput, user._id);
  }

  @UseGuards(GqlGuard)
  @Query(() => [Chat], { name: 'chats' })
  async findAll(): Promise<Chat[]> {
    return this.chatsService.findMany();
  }

  @Query(() => Chat, { name: 'chat' })
  async findOne(@Args('_id') _id: string): Promise<Chat> {
    return this.chatsService.findOne(_id);
  }

  @Mutation(() => Chat)
  updateChat(@Args('updateChatInput') updateChatInput: UpdateChatInput) {
    return this.chatsService.update(updateChatInput.id, updateChatInput);
  }

  @Mutation(() => Chat)
  removeChat(@Args('id', { type: () => Int }) id: number) {
    return this.chatsService.remove(id);
  }
}
