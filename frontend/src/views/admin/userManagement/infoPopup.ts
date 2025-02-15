import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import NETWORK from '@/data/network/network';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { UIManager } from '@ui_lib/UIManager';

export class InfoPopup {
  private readonly userId: string;
  private user: any;
  private userDetails: any;
  private userType: string;
  private detailList!: Quark;

  constructor(params: { userId: string; user: any; userType: string }) {
    this.userId = params.userId;
    this.user = params.user;
    this.userType = params.userType;
  }

  async loadData(): Promise<void> {
    try {
      const response = await NETWORK.get(`/api/admin/userManagement/${this.userType}/${this.userId}`, { showLoading: true, handleError: true, throwError: true });
      this.userDetails = response.data.users[0];
    } catch (error: any) {
      throw error;
    }
  }

  async render(parent: HTMLElement): Promise<void> {
    const overlay = $(parent, 'div', 'position-fixed top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center bg-opacity-50', {}, (q) => {
      // Content
      $(q, 'div', 'position-relative mx-auto container-md bg-secondary px-3 py-2 rounded-3', {}, (q) => {
        $(q, 'div', 'heading', {}, (q) => {
          $(q, 'h3', '', {}, 'User Details');
        });

        this.detailList = $(q, 'ul', '', {}, (q) => {
          console.log('user fields: ', this.user);
          UIManager.listObject(q, this.user);
        });

        $(q, 'div', 'buttons d-flex justify-content-center', {}, (q) => {
          new IconButton({
            type: ButtonType.PRIMARY,
            icon: 'fa-solid fa-xmark',
            label: 'Close',
            onClick: async () => {
              this.closePopup(overlay);
            },
          }).render(q);
        });
      });
    });

    try {
      await this.loadData();
      console.log('detail list: ', this.detailList);
      console.log('user details: ', this.userDetails);
      UIManager.listObject(this.detailList, this.userDetails, ['passwordHash']);
    } catch (error: any) {
      return;
    }

    overlay.addEventListener('click', (event) => {
      console.log('clicked on event: ', event.target);
      if (event.target === overlay) {
        this.closePopup(overlay);
      }
    });
  }

  private closePopup(overlay: HTMLElement): void {
    overlay.remove();
  }
}
