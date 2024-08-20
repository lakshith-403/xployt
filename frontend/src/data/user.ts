import NETWORK from './network';
import { CacheObject, DataFailure } from './cacheBase';

export class User {
  id: number;
  username: string;
  email: string;

  constructor(data: any) {
    this.id = data['id'];
    this.username = data['username'];
    this.email = data['email'];
  }
}

export class UserCache extends CacheObject<User> {
  async load(): Promise<User> {
    const response = await NETWORK.getCurrentUser();

    if (!response.is_successful)
      throw new DataFailure('load user', response.error ?? '');

    return new User(response['data']);
  }

  async signIn(username: string, password: string): Promise<User> {
    const response = await NETWORK.signIn(username, password);

    if (!response.is_successful)
      throw new DataFailure('load user', response.error ?? '');

    return new User(response.data);
  }

  async signOut(): Promise<void> {
    const response = await NETWORK.signOut();

    if (!response.is_successful)
      throw new DataFailure('load user', response.error ?? '');

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
      username: 'mock',
      email: 'mock@mock.com',
    });
  }

  async signIn(username: string, password: string): Promise<User> {
    return new User({
      id: 1,
      username: username,
      email: 'mock@mock.com',
    });
  }

  async signOut(): Promise<void> {
    this.invalidate_cache();
  }
}
