import { ProfileService } from '../../../services/profile.service';
import { Response } from '../../network/network';
export class userEndpoints {
   static async getUserProfile(userId: string): Promise<Response> {
       try {
           console.log('userEndpoints: Getting profile for user:', userId);
           // Use the existing ProfileService
           const response = await fetch('/api/profile', {
               method: 'GET',
               headers: {
                   'Content-Type': 'application/json'
               }
           });
           const data = await response.json();
           console.log('userEndpoints: Response received:', data);
           
           return {
               data: data,
               is_successful: true
           };
       } catch (error) {
           console.error('userEndpoints: Error:', error);
           return {
               is_successful: false,
               error: error instanceof Error ? error.message : 'Unknown error'
           };
       }
   }
    static async updateUserProfile(userId: string, profileData: any): Promise<Response> {
       try {
           console.log('userEndpoints: Updating profile:', profileData);
           const response = await fetch('/api/profile', {
               method: 'PUT',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(profileData)
           });
           const data = await response.json();
           console.log('userEndpoints: Update response:', data);
            return {
               data: data,
               is_successful: true
           };
       } catch (error) {
           console.error('userEndpoints: Update error:', error);
           return {
               is_successful: false,
               error: error instanceof Error ? error.message : 'Unknown error'
           };
       }
   }
}
