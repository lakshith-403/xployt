import { CacheObject, DataFailure } from '../../cacheBase';
import { userEndpoints } from './../network/user.network';

export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  fundsRemaining?: number;
  fundsSpent?: number;
}

export class UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  fundsRemaining?: number;
  fundsSpent?: number;
  constructor(data: any) {
    console.log('Creating UserProfile instance with data:', data);
    this.id = data['userId'];
    this.name = data['name'];
    this.email = data['email'];
    this.phoneNumber = data['phone'];
    this.profilePicture = data['profile_picture'];
    this.fundsRemaining = data['funds_remaining'];
    this.fundsSpent = data['funds_spent'];
    console.log('UserProfile instance created:', this);
  }
}

export class UserProfileCache extends CacheObject<UserProfile> {
  async load(userId: string): Promise<UserProfile> {
    console.log('UserProfileCache: Loading profile for userId:', userId);
    try {
      console.log('UserProfileCache: Sending request to getUserProfile endpoint');
      const response = await userEndpoints.getUserProfile(userId);
      console.log('UserProfileCache: Received response:', response);
      if (!response.is_successful) {
        console.error('UserProfileCache: Failed to load profile:', response.error);
        throw new DataFailure('load user profile', response.error ?? '');
      }
      console.log('UserProfileCache: Successfully loaded profile data');
      return new UserProfile(response.data as UserProfileResponse);
    } catch (error) {
      console.error('UserProfileCache: Error in load method:', error);
      throw error;
    }
  }
  async updateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    console.log('UserProfileCache: Updating profile for userId:', userId);
    console.log('UserProfileCache: Update data:', profileData);
    try {
      console.log('UserProfileCache: Sending request to updateUserProfile endpoint');
      const response = await userEndpoints.updateUserProfile(userId, profileData);
      console.log('UserProfileCache: Received update response:', response);
      if (!response.is_successful) {
        console.error('UserProfileCache: Failed to update profile:', response.error);
        throw new DataFailure('update user profile', response.error ?? '');
      }
      console.log('UserProfileCache: Successfully updated profile');
      this.invalidate_cache();
      console.log('UserProfileCache: Cache invalidated');
      return new UserProfile(response.data);
    } catch (error) {
      console.error('UserProfileCache: Error in updateProfile method:', error);
      throw error;
    }
  }
}
export class UserProfileCacheMock extends UserProfileCache {
  constructor() {
    super();
  }
  async load(userId: string): Promise<UserProfile> {
    console.log('UserProfileCacheMock: Loading profile for userId:', userId);
    return new UserProfile({
      id: '101',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phoneNumber: '1234567890',
      profilePicture: 'https://via.placeholder.com/150',
      fundsRemaining: 1000,
      fundsSpent: 0,
    });
  }
}