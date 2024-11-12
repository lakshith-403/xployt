import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import './notifications.scss';

export interface Notification {
    title: string;
    subtitle: string;
    platform: string;
    highlight?: boolean;
}

export class NotificationList {
    private notifications: Notification[];

    constructor(notifications: Notification[]) {
        this.notifications = notifications;
    }

    render(parent: Quark) {
        $(parent, 'div', 'notification-list', {}, (q) => {
            $(q, 'h2', 'notification-header', {}, "Notifications");

            this.notifications.forEach((notification) => {
                $(q, 'div', `notification-item ${notification.highlight ? 'highlight' : ''}`, {}, (q) => {
                    $(q, 'p', 'notification-title', {}, notification.title);
                    $(q, 'p', 'notification-subtitle', {}, `${notification.subtitle} - ${notification.platform}`);
                });
            });
        });
    }
}
