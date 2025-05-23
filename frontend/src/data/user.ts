import { router } from '@/ui_lib/router';
import { CacheObject, DataFailure } from './cacheBase';
import { AuthEndpoints } from './network/auth.network';
export type UserType = 'Client' | 'Validator' | 'ProjectLead' | 'Hacker' | 'Guest' | 'Admin';

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
    // console.log('User constructor', data);
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.email = data.email;
    this.type = data.type;
    this.avatar = data.avatar;
  }

  static getGuestUser(): User {
    return new User({
      id: '',
      username: '',
      name: '',
      email: '',
      type: 'Guest',
      avatar: '',
    });
  }
}

// Getting an error is expected if you aren't logged in
export class UserCache extends CacheObject<User> {
  async load(): Promise<User> {
    try {
      const response = await AuthEndpoints.getCurrentUser();
      return new User(response.data as UserResponse);
    } catch (error) {
      console.error('Error loading user:', error);
      return User.getGuestUser();
    }
  }

  async register(name: string, email: string, password: string, role: UserType): Promise<User> {
    const response = await AuthEndpoints.register(name, email, password, role);
    this.data = new User(response.data as UserResponse);
    console.log('User registered:', this.data);

    router.rerenderNavigationView();
    return this.data;
  }

  async signIn(username: string, password: string): Promise<User> {
    const response = await AuthEndpoints.signIn(username, password);
    this.data = new User(response.data as UserResponse);

    console.log('User signed in:', this.data);

    router.rerenderNavigationView();
    return this.data;
  }

  async signOut(): Promise<void> {
    const response = await AuthEndpoints.signOut();
    this.invalidate_cache();
    router.rerenderNavigationView();
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
      avatar: '',
    });
  }

  async signIn(username: string, password: string): Promise<User> {
    return new User({
      id: '1',
      name: 'Mock User2',
      username: username,
      email: 'mock@mock.com',
      type: 'Client',
      avatar: '',
    });
  }

  async signOut(): Promise<void> {
    this.invalidate_cache();
  }
}
