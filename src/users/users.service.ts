import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserInput: CreateUserInput) {
    return this.userRepository.create({
      ...createUserInput,
      password: await bcrypt.hash(createUserInput.password, 10),
    });
  }

  async findAll() {
    return await this.userRepository.find({});
  }

  async findOne(_id: string) {
    return await this.userRepository.findOne({ _id });
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    return this.userRepository.findOneAndUpdate(
      { _id },
      {
        $set: {
          ...updateUserInput,
          password: await bcrypt.hash(updateUserInput.password, 10),
        },
      },
    );
  }

  async remove(_id: string) {
    return this.userRepository.findOneAndDelete({ _id });
  }
}
