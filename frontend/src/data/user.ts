import { CacheObject, DataFailure } from './cacheBase';
import { AuthEndpoints } from './network/auth.network';
export type UserType = 'Client' | 'Validator' | 'Lead' | 'Hacker';

export class User {
  id: number;
  username: string;
  name: string;
  email: string;
  type: UserType;
  avatar: string;

  constructor(data: any) {
    console.log('User constructor', data);
    this.id = data['userId'];
    this.username = data['username'];
    this.name = data['name'];
    this.email = data['email'];
    this.type = data['role'];
    this.avatar = '';
  }
}

export class UserCache extends CacheObject<User> {
  async load(): Promise<User> {
    const response = await AuthEndpoints.getCurrentUser();

    return new User(response);
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const response = await AuthEndpoints.register(name, email, password);

    return new User(response);
  }

  async signIn(username: string, password: string): Promise<User> {
    const response = await AuthEndpoints.signIn(username, password);

    return new User(response);
  }

  async signOut(): Promise<void> {
    const response = await AuthEndpoints.signOut();

    this.invalidate_cache();
  }
}

/**
 * Use this instead of UserCache to mock the user data.
 *
 * i.e. `import {UserCacheMock as UserCache} from "./user"`
 * */
export class UserCacheMock extends CacheObject<User> {
  async load(): Promise<User> {
    return new User({
      id: 1,
      name: 'Mock User1',
      username: 'mock',
      email: 'mock@mock.com',
      type: process.env.ROLE as UserType,
    });
  }

  async signIn(username: string, password: string): Promise<User> {
    return new User({
      id: 1,
      name: 'Mock User2',
      username: username,
      email: 'mock@mock.com',
      type: 'Client',
    });
  }

  async signOut(): Promise<void> {
    this.invalidate_cache();
  }
}
