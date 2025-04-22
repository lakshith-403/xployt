import { CacheObject, DataFailure } from '../../cacheBase';
import { notificationEndPoints }  from "../network/notifications.network";

interface NotificationListResponse {
    data: NotificationInfo[];
    is_successful: boolean;
    error?: string;
    trace?: string;
}

interface NotificationInfo {
    id: number;
    userId: number;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    url: string;
}

export class Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    url: string;

    constructor(data: any) {
        this.id = data['id'];
        this.userId = data['userId'];
        this.title = data['title'];
        this.message = data['message'];
        this.timestamp = data['timestamp'];
        this.isRead = data['isRead'];
        this.url = data['url'];
    }

    markAsRead(): void {
        this.isRead = true;
    }


}

export class NotificationsCache extends CacheObject<Notification[]> {
    async load(userId: string): Promise<Notification[]> {
        console.log(`Loading notifications for user: ${userId}`);
        let response: NotificationListResponse;

        try{
            response = (await notificationEndPoints.getNotifications(userId)) as NotificationListResponse;
        }catch (error) {
            console.error('Network error while fetching notifications:', error);
            throw new DataFailure('load notifications', 'Network error');
        }

        if (!response.is_successful){
            console.error('Failed to load notifications:', response.error);
            throw new DataFailure('load project', response.error ?? '');
        }

        return response.data.map((notificationInfo: NotificationInfo) => {
            return new Notification({ ...notificationInfo });
        });
    }

    async markAsRead(notification:Notification): Promise<void>{
        console.log("Marking notification as read: ", notification.id);

        notification.markAsRead();

        try{
            await notificationEndPoints.markAsRead(notification.id);
        } catch (error){
            console.error('Network error while updating notifications:', error);
            throw new DataFailure('update notifications', 'Network error');
        }
    }
}

export class NotificationsCacheMock extends CacheObject<Notification[]> {
    async load(userId: string): Promise<Notification[]> {
        const allNotifications = [
            new Notification({
                id: 1,
                userId: 1,
                title: "#26789 - Lifebuoy Platform",
                message: "Your report was accepted by Jane Doe",
                timestamp: '2024-11-14T09:00:00Z',
                isRead: false,
            }),
            new Notification({
                id: 2,
                userId: 1,
                title: "Admin",
                message: 'Your password will expire soon.',
                timestamp: '2024-11-13T10:15:00Z',
                isRead: false,
            }),
            new Notification({
                id: 3,
                userId: 1,
                title: "#27985 - Uniliver Platform",
                message: "Confirm Payment",
                timestamp: '2024-11-12T15:45:00Z',
                isRead: true,
            }),
            new Notification({
                id: 3,
                userId: 2,
                title: "#27985 - Uniliver Platform",
                message: "Confirm payment",
                timestamp: '2024-11-12T15:45:00Z',
                isRead: false,
            })
        ];
        return allNotifications.filter(notification => notification.userId === Number(userId));
    }
}
