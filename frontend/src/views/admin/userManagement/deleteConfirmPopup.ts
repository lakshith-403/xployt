import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import NETWORK from '@/data/network/network';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { UIManager } from '@ui_lib/UIManager';

export class DeleteConfirmPopup {
  private readonly userId: string;
  private user: any;
  private userType: string;
  private overlay!: HTMLElement;

  constructor(params: { userId: string; user: any; userType: string }) {
    this.userId = params.userId;
    this.user = params.user;
    this.userType = params.userType;
  }

  async render(parent: HTMLElement): Promise<void> {
    this.overlay = $(parent, 'div', 'position-fixed top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center bg-opacity-50', {}, (q) => {
      // Content
      $(q, 'div', 'position-relative mx-auto container-md bg-secondary px-3 py-2 rounded-3', {}, (q) => {
        $(q, 'div', 'sub-heading-2', {}, (q) => {
          $(q, 'h3', '', {}, 'Delete User');
        });

        $(q, 'div', 'body', {}, (q) => {
          $(q, 'p', 'paragraph', {}, 'Are you sure you want to delete this user?');
        });

        $(q, 'div', 'buttons d-flex justify-content-center gap-2', {}, (q) => {
          new IconButton({
            type: ButtonType.PRIMARY,
            icon: 'fa-solid fa-xmark',
            label: 'Close',
            onClick: async () => {
              this.closePopup(this.overlay);
            },
          }).render(q);

          new IconButton({
            type: ButtonType.PRIMARY,
            icon: 'fa-solid fa-check',
            label: 'Delete',
            onClick: async () => {
              this.deleteUser();
            },
          }).render(q);
        });
      });
    });

    this.overlay.addEventListener('click', (event: MouseEvent) => {
      console.log('clicked on event: ', event.target);
      if (event.target === this.overlay) {
        this.closePopup(this.overlay);
      }
    });
  }

  private closePopup(overlay: HTMLElement): void {
    overlay.remove();
  }

  private async deleteUser(): Promise<void> {
    try {
      const response = await NETWORK.delete(`/api/admin/userManagement/${this.userType}/${this.userId}`, { showLoading: true, handleError: true, throwError: true });
      if (response.status === 200) {
        this.closePopup(this.overlay);
      }
      console.log('deleting user: ', this.userId);
    } catch (error: any) {
      throw error;
    }
  }
}
