import {Quark, QuarkFunction as $} from '@ui_lib/quark';
import {IconButton} from "@components/button/icon.button";
import {Notification, NotificationsCache} from "@data/common/cache/notifications.cache";
import './notifications.scss';
import {router} from "@ui_lib/router";

export class Notifications {
    private userId: string;
    private container: Quark;
    private notifications: Notification[] = [];
    private readonly notificationCache: NotificationsCache;
    private isVisible = false;

    private notificationListPane!: Quark;
    private buttonComponent!: Quark;

    constructor(container: Quark, userId: string) {
        this.userId = userId;
        this.container = container;
        this.notificationCache = new NotificationsCache();
    }

    private async loadNotifications(): Promise<void> {
        try {
            this.notifications = await this.notificationCache.load(this.userId);
            console.log("Notifications :", this.notifications);
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    }

    private renderNotificationsButton(type: String) {
        this.buttonComponent.innerHTML = '';
        let icon;
        if(type == "unread"){
            icon = 'fa-solid fa-bell'
        }else if (type == "open"){
            icon = 'fa-regular fa-bell'
        }else {
            icon = 'fa-solid fa-bell-slash'
        }

        new IconButton({
            icon: icon,
            label: '',
            onClick: () => {
                this.isVisible = !this.isVisible;
                this.renderNotificationsList().then();
                this.renderNotificationsButton(this.isVisible ? "unread" : "open");
            }
        }).render(this.buttonComponent)
    }

    private async renderNotificationsList(): Promise<void> {
    this.notificationListPane.innerHTML = '';

    if (this.isVisible) {
        this.notificationListPane.style.display = "block"; // Show the notification list
        $(this.notificationListPane, 'div', '', {}, async (q) => {
            $(q, 'h2', 'notification-header', {}, "Notifications");

            await this.loadNotifications();

            if (this.notifications.length === 0) {
                $(q, 'p', 'no-notifications', {}, "No notifications available.");
                return;
            }

            this.notifications.slice(0, 10).forEach((notification) => {
                const notificationElement = $(q, 'div', `notification-item ${notification.isRead ? '' : 'highlight'}`, {}, (q) => {
                    $(q, 'span', 'notification-data', {}, (q) => {
                        $(q, 'p', 'notification-title', {}, notification.title);
                        $(q, 'p', '', {}, this.getTimeDifference(notification.timestamp));
                    });
                    $(q, 'p', 'notification-message', {}, notification.message);
                });
                notificationElement.addEventListener('click', (e) =>{
                    e.preventDefault();
                    e.stopPropagation();
                    this.notificationCache.markAsRead(notification);
                    router.navigateTo(notification.url);
                })
            });
        });
    } else {
        this.notificationListPane.style.display = "none"; // Hide the notification list
    }
}
    render(): void {
        // toggle button
        $(this.container, 'div', 'notifications', {}, (q) => {

            this.buttonComponent = $(q, 'div', 'notification-button', {})

            this.renderNotificationsButton("open");

            // new IconButton({
            //     icon: 'fa-solid fa-bell',
            //     label: '',
            //     onClick: () => {}
            // }).render(this.buttonComponent)

            this.notificationListPane = $(q, 'div', 'notification-list', {})

        });
    }

    private getTimeDifference = (timestamp: string) => {
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
}
