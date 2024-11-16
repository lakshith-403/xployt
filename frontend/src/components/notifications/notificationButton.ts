import {Quark, QuarkFunction as $} from '@ui_lib/quark';
import {NotificationList} from './notificationsList';
import {IconButton} from "@components/button/icon.button";

export class NotificationButton {
    private notificationList: NotificationList;
    private container: Quark;
    private iconButton: IconButton | null = null;

    constructor(notificationList: NotificationList, container: Quark) {
        this.notificationList = notificationList;
        this.container = container;

    }

    // private updateIcon(): string {
    //     return this.notificationList.isVisible ? 'fa-solid fa-bell' : 'fa-regular fa-bell';
    // }

    render(): void {
        // toggle button
        $(this.container, 'div', 'notifications', {}, (q) => {
            this.iconButton = new IconButton({
                icon: 'fa-regular fa-bell',
                label: '',
                onClick: () => {
                    this.notificationList.toggleVisibility();
                    this.notificationList.render(q);
                }
            })

            this.iconButton?.render(q)

            // Render the initial state of the notification list
            this.notificationList.render(q);
        });
    }
}
