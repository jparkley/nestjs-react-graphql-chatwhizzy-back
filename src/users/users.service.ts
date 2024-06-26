import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserRepository } from './users.repository';
import { S3Service } from 'src/common/s3/s3.service';
import { BUCKET, PROFILE_IMAGE_TYPE } from 'src/constants';
import { UserDataForToken } from 'src/auth/auth-types';
import { UserDocument } from './entities/user.document';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

  async create(createUserInput: CreateUserInput) {
    try {
      const newUser = await this.userRepository.create({
        ...createUserInput,
        password: await bcrypt.hash(createUserInput.password, 10),
      });
      return this.transferToEntity(newUser);
    } catch (error) {
      const message =
        error.code == '11000' ? 'Email already exists' : error.message;
      throw new Error(message);
    }
  }

  async findAll() {
    return (await this.userRepository.find({})).map((user) =>
      this.transferToEntity(user),
    );
  }

  async findOne(_id: string) {
    return this.transferToEntity(await this.userRepository.findOne({ _id }));
  }

  async update(_id: string, updateUserInput: UpdateUserInput) {
    if (updateUserInput.password) {
      updateUserInput.password = await bcrypt.hash(
        updateUserInput.password,
        10,
      );
    }
    const user = await this.userRepository.findOneAndUpdate(
      { _id },
      {
        $set: { ...updateUserInput },
      },
    );
    return this.transferToEntity(user);
  }

  async remove(_id: string) {
    return this.transferToEntity(
      await this.userRepository.findOneAndDelete({ _id }),
    );
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email }); // includes error handling
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      throw new UnauthorizedException('Password is not valid');
    }
    return this.transferToEntity(user);
  }

  private getProfileImage(userId: string) {
    return `${userId}.${PROFILE_IMAGE_TYPE}`;
  }

  async uploadImage(file: Buffer, userId: string) {
    await this.s3Service.upload({
      bucket: BUCKET,
      key: this.getProfileImage(userId),
      file,
    });
  }

  transferToEntity(userDocument: UserDocument) {
    const user = {
      ...userDocument,
      imageUrl: this.s3Service.getImageUrl(
        BUCKET,
        this.getProfileImage(userDocument._id.toHexString()),
      ),
    };
    delete user.password;
    return user;
  }
}
