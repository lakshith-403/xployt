import NETWORK, { Response } from '../../network/network';

export class notificationEndPoints {
    private static readonly BASE_URL: string =  "/api/notifications/"
    static async getNotifications(userId: string): Promise<Response> {
        return NETWORK.sendHttpRequest(
            'GET',
            `${this.BASE_URL}${userId}`
        );
    }

    static async markAsRead(notificationId: number){
        return NETWORK.sendHttpRequest(
            'PUT',
            this.BASE_URL + notificationId
        )
    }
}