export class ProfileService {
    private static BASE_URL = '/api/profile';

    public static async getProfile(): Promise<any> {
        const response = await fetch(this.BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return await response.json();
    }

    public static async updateProfile(profileData: any): Promise<any> {
        const response = await fetch(this.BASE_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profileData)
        });
        return await response.json();
    }

    public static async updateProfilePicture(formData: FormData): Promise<any> {
        const response = await fetch(`${this.BASE_URL}/picture`, {
            method: 'PUT',
            body: formData
        });
        return await response.json();
    }
}