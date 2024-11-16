import { CacheObject, DataFailure } from './cacheBase';
import { AuthEndpoints } from './network/auth.network';

type UserType = 'Client' | 'Validator' | 'Lead' | 'Hacker';

export class User {
  id: number;
  username: string;
  email: string;
  type: UserType;

  constructor(data: any) {
    this.id = data['id'];
    this.username = data['username'];
    this.email = data['email'];
    this.type = data['type'];
  }
}

export class UserCache extends CacheObject<User> {
  async load(): Promise<User> {
    const response = await AuthEndpoints.getCurrentUser();

    if (!response.is_successful) throw new DataFailure('load user', response.error ?? '');

    return new User(response['data']);
  }

  async signIn(username: string, password: string): Promise<User> {
    const response = await AuthEndpoints.signIn(username, password);

    if (!response.is_successful) throw new DataFailure('load user', response.error ?? '');

    return new User(response.data);
  }

  async signOut(): Promise<void> {
    const response = await AuthEndpoints.signOut();

    if (!response.is_successful) throw new DataFailure('load user', response.error ?? '');

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
      type: 'Client',
    });
  }

  async signIn(username: string, password: string): Promise<User> {
    return new User({
      id: 1,
      username: username,
      email: 'mock@mock.com',
      type: 'Client',
    });
  }

  async signOut(): Promise<void> {
    this.invalidate_cache();
  }
}
