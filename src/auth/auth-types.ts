import { User } from 'src/users/entities/user.entity';

export type UserDataForToken = Omit<User, '_id'> & { _id: string };
