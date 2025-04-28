import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import NETWORK from '@/data/network/network';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { UIManager } from '@ui_lib/UIManager';
import { PopupLite } from '@components/popup/popup-lite';

export class DeleteConfirmPopup {
  private readonly userId: string;
  private user: any;
  private userType: string;
  private popup: PopupLite;
  private renderFunction: () => Promise<void>;

  constructor(params: { userId: string; user: any; userType: string; renderFunction: () => Promise<void> }) {
    this.userId = params.userId;
    this.user = params.user;
    this.userType = params.userType;
    this.popup = new PopupLite();
    this.renderFunction = params.renderFunction;
  }

  async render(parent: HTMLElement): Promise<void> {
    this.popup.render(parent, (q) => {
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
            this.popup.close();
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
  }

  private async deleteUser(): Promise<void> {
    try {
      const response = await NETWORK.delete(`/api/admin/userManagement/${this.userId}`, { showLoading: true, handleError: true, throwError: true });
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Success',
        '.modal-message': 'User deleted successfully',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
        NETWORK.invalidateCache('/api/admin/userManagement/ProjectLead');
        NETWORK.invalidateCache('/api/admin/userManagement/Validator');
        this.popup.close();
        this.renderFunction();
      });
      console.log('deleting user: ', this.userId);
    } catch (error: any) {
      this.popup.close();
      console.error('Error deleting user: ', error);
    }
  }
}
