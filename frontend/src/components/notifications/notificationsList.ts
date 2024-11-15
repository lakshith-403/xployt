import {Quark, QuarkFunction as $} from '@ui_lib/quark';
import './notifications.scss';
import {Notification, NotificationsCache} from '@data/hacker/cache/notifications.cache';
import {CACHE_STORE} from "@data/cache";

export class NotificationList {
    private params: { userId: string };
    private notifications: Notification[] = [];
    public isVisible: boolean;
    private element?: Quark;
    private readonly notificationCache: NotificationsCache;

    constructor(isVisible = false, params: { userId: string }) {
        this.params = params;
        // this.notifications = notifications;
        this.isVisible = isVisible;
        this.notificationCache = CACHE_STORE.getNotificationsList(this.params.userId);
    }

    private async loadNotifications(): Promise<void> {
        try {
            this.notifications = await this.notificationCache.get(false, this.params.userId) as Notification[];
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    }


    async render(parent: Quark): Promise<void> {

        // Clear existing content
        if (this.element) {
            this.element.remove();
        }

        const waiting = $(parent, 'div', 'loading-screen', {}, (q) => {
            $(q, 'div', 'spinner', {});
        });

        await this.loadNotifications();
        waiting.innerHTML = '';
        waiting.remove()

        this.element = $(parent, 'div', 'notification-list', {}, (q) => {
            $(q, 'h2', 'notification-header', {}, "Notifications");

            this.notifications.forEach((notification) => {
                const getTimeDifference = (timestamp: string) => {
                    const notificationDate = new Date(timestamp);
                    const now = new Date();
                    const diffInMilliseconds = now.getTime() - notificationDate.getTime();
                    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

                    if (diffInHours < 1) {
                        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
                        return diffInMinutes === 1 ? "1 minute ago" : `${diffInMinutes} minutes ago`;
                    } else if (diffInHours < 24) {
                        return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
                    } else {
                        const diffInDays = Math.floor(diffInHours / 24)
                        return diffInDays === 1 ? "1 day ago" : `${diffInDays} days ago`;
                    }
                };
                $(q, 'div', `notification-item ${notification.isRead ? '' : 'highlight'}`, {}, (q) => {
                    $(q, 'span', 'notification-data', {}, (q) => {
                        $(q, 'p', 'notification-title', {}, notification.title);
                        $(q, 'p', '', {}, getTimeDifference(notification.timestamp));
                    })
                    $(q, 'p', 'notification-message', {}, notification.message);
                });
            });
        });
        this.element.style.display = this.isVisible ? 'block' : 'none';

    }

    toggleVisibility(): void {
        this.isVisible = !this.isVisible;
        if (this.element) {
            this.element.style.display = this.isVisible ? 'block' : 'none';
        }
    }
}
