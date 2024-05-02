import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlGuard } from 'src/auth/guards/gql-guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/user.decorator';
import { UserDataForToken } from 'src/auth/auth-types';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(GqlGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(GqlGuard)
  findOne(@Args('_id') _id: string) {
    return this.usersService.findOne(_id);
  }

  // Return a current(active) user for route protection on client
  @UseGuards(GqlGuard)
  @Query(() => User, { name: 'currentUser' })
  getCurrentUser(@CurrentUser() user: UserDataForToken) {
    return user;
  }

  @Mutation(() => User)
  @UseGuards(GqlGuard)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: UserDataForToken,
  ) {
    return this.usersService.update(user._id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(GqlGuard)
  removeUser(@CurrentUser() user: UserDataForToken) {
    return this.usersService.remove(user._id);
  }
}
