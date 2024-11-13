import {Quark, QuarkFunction as $} from '@ui_lib/quark';
import './notifications.scss';

interface Notification {
    title: string;
    subtitle: string;
    platform: string;
    highlight?: boolean;
}

export class NotificationList {
    private notifications: Notification[];
    public isVisible: boolean;
    private element?: Quark;

    constructor(notifications: Notification[], isVisible = false) {
        this.notifications = notifications;
        this.isVisible = isVisible;
    }

    render(parent: Quark): void {
        // Clear existing content
        if (this.element) {
            this.element.remove();
        }

        this.element = $(parent, 'div', 'notification-list', {}, (q) => {
            $(q, 'h2', 'notification-header', {}, "Notifications");

            this.notifications.forEach((notification) => {
                $(q, 'div', `notification-item ${notification.highlight ? 'highlight' : ''}`, {}, (q) => {
                    $(q, 'p', 'notification-title', {}, notification.title);
                    $(q, 'p', 'notification-subtitle', {}, `${notification.subtitle} - ${notification.platform}`);
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
