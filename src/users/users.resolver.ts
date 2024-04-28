import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserEntity)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [UserEntity], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => UserEntity, { name: 'user' })
  findOne(@Args('_id') _id: string) {
    return this.usersService.findOne(_id);
  }

  @Mutation(() => UserEntity)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => UserEntity)
  removeUser(@Args('_id') _id: string) {
    return this.usersService.remove(_id);
  }
}
