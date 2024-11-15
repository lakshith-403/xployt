import NETWORK, { Response } from './../../network/network';

export class notificationEndPoints {
    static async getNotifications(userId: string): Promise<Response> {
        return NETWORK.sendHttpRequest(
            'GET',
            `/api/notifications/${userId}`
        );
    }
}