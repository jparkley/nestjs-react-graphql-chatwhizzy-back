import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlGuard } from 'src/auth/guards/gql-guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/user.decorator';
import { UserDataForToken } from 'src/auth/auth-types';
import { Types } from 'mongoose';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(GqlGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GqlGuard)
  findOne(@Args('_id') _id: string): Promise<User> {
    return this.usersService.findOne(_id);
  }

  // Return a current(active) user for route protection on client
  @UseGuards(GqlGuard)
  @Query(() => User, { name: 'currentUser' })
  getCurrentUser(@CurrentUser() user: UserDataForToken) {
    return { ...user, _id: new Types.ObjectId(user._id) };
  }

  @Mutation(() => User)
  @UseGuards(GqlGuard)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: UserDataForToken,
  ): Promise<User> {
    return this.usersService.update(user._id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(GqlGuard)
  async removeUser(@CurrentUser() user: UserDataForToken): Promise<User> {
    return this.usersService.remove(user._id);
  }
}
