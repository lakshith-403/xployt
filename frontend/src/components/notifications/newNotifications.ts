import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { IconButton } from '@components/button/icon.button';
import { Notification, NotificationsCache } from '@data/common/cache/notifications.cache';
import './notifications.scss';
import { router } from '@ui_lib/router';

export class Notifications {
  private userId: string;
  private container: Quark;
  private notifications: Notification[] = [];
  private readonly notificationCache: NotificationsCache;
  private isVisible = false;
  private hasUnreadNotifications = false;

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
      console.log('Notifications :', this.notifications);
      // Check if there are any unread notifications
      this.hasUnreadNotifications = this.notifications.some((notification) => !notification.isRead);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }

  private renderNotificationsButton(type: string): void {
    this.buttonComponent.innerHTML = '';
    console.log('type :', type);
    const icon = type === 'unread' ? 'fa-solid fa-bell' : type === 'open' ? 'fa-regular fa-bell' : 'fa-solid fa-bell-slash';

    const button = new IconButton({
      icon: icon,
      label: '',
      onClick: (event) => {
        event.stopPropagation(); // Prevent click from propagating
        this.isVisible = !this.isVisible;
        this.renderNotificationsList().then();

        // Update button state based on visibility and unread status
        const newType = this.hasUnreadNotifications ? 'unread' : 'open';
        this.renderNotificationsButton(newType);

        if (this.isVisible) {
          document.addEventListener('click', this.handleOutsideClick);
        } else {
          document.removeEventListener('click', this.handleOutsideClick);
        }
      },
    });

    button.render(this.buttonComponent);

    // Add notification dot for unread notifications
    if (type === 'unread') {
      const buttonElement = this.buttonComponent.querySelector('button');
      if (buttonElement) {
        buttonElement.style.position = 'relative';

        const dot = document.createElement('span');
        dot.style.position = 'absolute';
        dot.style.top = '5px';
        dot.style.right = '10px';
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.backgroundColor = 'red';
        dot.style.borderRadius = '50%';
        dot.style.display = 'block';

        buttonElement.appendChild(dot);
      }
    }
  }

  private handleOutsideClick = (event: MouseEvent): void => {
    if (!this.notificationListPane.contains(event.target as Node) && !this.buttonComponent.contains(event.target as Node)) {
      this.isVisible = false;
      this.renderNotificationsList().then();
      this.renderNotificationsButton('open');
      document.removeEventListener('click', this.handleOutsideClick);
    }
  };

  private async renderNotificationsList(): Promise<void> {
    this.notificationListPane.innerHTML = '';

    if (this.isVisible) {
      this.notificationListPane.style.display = 'block'; // Show the notification list
      $(this.notificationListPane, 'div', '', {}, async (q) => {
        $(q, 'h2', 'notification-header', {}, 'Notifications');

        await this.loadNotifications();

        // Update button state based on unread status
        if (this.hasUnreadNotifications) {
          this.renderNotificationsButton('unread');
        }

        if (this.notifications.length === 0) {
          $(q, 'p', 'no-notifications', {}, 'No notifications available.');
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
          notificationElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.notificationCache.markAsRead(notification);

            // Recalculate unread status after marking as read
            notification.isRead = true;
            this.hasUnreadNotifications = this.notifications.some((n) => !n.isRead);

            // Update the button if no more unread notifications
            if (!this.hasUnreadNotifications) {
              this.renderNotificationsButton('open');
            }

            router.navigateTo(notification.url);
          });
        });
      });
    } else {
      this.notificationListPane.style.display = 'none'; // Hide the notification list
    }
  }
  render(): void {
    // toggle button
    $(this.container, 'div', 'notifications', {}, (q) => {
      this.buttonComponent = $(q, 'div', 'notification-button', {});

      // Load notifications to check for unread ones
      this.loadNotifications().then(() => {
        // Initial render based on unread status
        this.renderNotificationsButton(this.hasUnreadNotifications ? 'unread' : 'open');
      });

      this.notificationListPane = $(q, 'div', 'notification-list', {});

      document.addEventListener('click', this.handleOutsideClick);
    });
  }

  private getTimeDifference = (timestamp: string) => {
    const notificationDate = new Date(timestamp);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - notificationDate.getTime();
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
      return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
  };
}
