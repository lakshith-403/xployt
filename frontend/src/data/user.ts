import { CacheObject, DataFailure } from './cacheBase';
import { AuthEndpoints } from './network/auth.network';
export type UserType = 'Client' | 'Validator' | 'Lead' | 'Hacker';

interface UserResponse {
    id: string;
    username: string;
    name: string;
    email: string;
    type: UserType;
    avatar: string;
}

export class PublicUser {
  id?: number;
  name: string;
  email: string;

  constructor(data: any) {
    this.id = data.userId;
    this.name = data.name;
    this.email = data.email;
  }

  public removeId(): { name: string; email: string } {
    const { id, ...userWithoutId } = this;
    return userWithoutId;
  }
}

export class User {
  id: string;
  username: string;
  name: string;
  email: string;
  type: UserType;
  avatar: string;

  constructor(data: UserResponse) {
    console.log('User constructor', data);
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.email = data.email;
    this.type = data.type;
    this.avatar = data.avatar;
  }
}

export class UserCache extends CacheObject<User> {
  async load(): Promise<User> {
    const response = await AuthEndpoints.getCurrentUser();
    return new User(response.data as UserResponse);
  }

  async register(name: string, email: string, password: string): Promise<User> {
    const response = await AuthEndpoints.register(name, email, password);
    return new User(response.data as UserResponse);
  }

  async signIn(username: string, password: string): Promise<User> {
    const response = await AuthEndpoints.signIn(username, password);
    return new User(response.data as UserResponse);
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
      id: '101',
      name: 'Mock User1',
      username: 'mock',
      email: 'mock@mock.com',
      type: process.env.ROLE as UserType,
      avatar: ''
    });
  }

  async signIn(username: string, password: string): Promise<User> {
    return new User({
      id: '1',
      name: 'Mock User2',
      username: username,
      email: 'mock@mock.com',
      type: 'Client',
      avatar: ''
    });
  }

  async signOut(): Promise<void> {
    this.invalidate_cache();
  }
}
