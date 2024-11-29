import { ProfileService } from '../../../services/profile.service';
import { Response } from '../../network/network';
import NETWORK from '../../network/network';
export class userEndpoints {
  static async getUserProfile(userId: string): Promise<Response> {
    return await NETWORK.sendHttpRequest('GET', `/api/profile/${userId}`);

    //    try {
    //        console.log('userEndpoints: Getting profile for user:', userId);
    //        console.log('userEndpoints: Response received:', response.data);
    //         return response;

    //    } catch (error) {
    //        console.error('userEndpoints: Error:', error);
    //    }
  }
  static async updateUserProfile(userId: string, profileData: any): Promise<Response> {
    return await NETWORK.sendHttpRequest('PUT', `/api/profile/${userId}`, profileData);
  }
}
