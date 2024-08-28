import Email from 'src/User/Domain/Email';
import User from 'src/User/Domain/User';
import UserId from 'src/User/Domain/UserId';

export const UserRepository = Symbol('UserRepository').valueOf();
export interface UserRepository {
  load(userId: UserId): Promise<User | null>;
  loadByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
}
