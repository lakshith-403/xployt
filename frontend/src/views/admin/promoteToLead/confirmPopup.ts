import { QuarkFunction as $ } from '@ui_lib/quark';
import { CACHE_STORE } from '@data/cache';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import NETWORK from '@/data/network/network';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';

export class confirmPromoteToLead {
  private readonly userId: string;
  private application: any;

  constructor(params: { userId: string }) {
    this.userId = params.userId;
  }

  async loadData(): Promise<void> {
    try {
      const response = await NETWORK.get(`/api/admin/applicationData/${this.userId}`, { showLoading: true });
      this.application = response.data.applicationData[0];
      console.log('application data: ', this.application);
    } catch (error) {
      console.error('Failed to load project data', error);
    }
  }

  async render(parent: HTMLElement): Promise<void> {
    $(parent, 'div', 'confirm-promote-to-lead position-fixed top-0 left-0 w-100 h-100 d-flex align-items-center justify-content-center', {}, (q) => {
      // Content
      $(q, 'div', 'position-relative mx-auto container-md bg-secondary p-3 rounded-3', {}, (q) => {
        $(q, 'div', 'heading', {}, (q) => {
          $(q, 'h3', '', {}, 'Validator Details');
        });

        $(q, 'ul', '', {}, (q) => {});
        $(q, 'div', 'buttons', {}, (q) => {
          new IconButton({
            type: ButtonType.PRIMARY,
            icon: 'fa-solid fa-check',
            label: 'Promote',
            onClick: async () => {
              console.log('Promote');
              // Fetch data when the button is clicked
            },
          }).render(q);
        });
      });
    });
  }
}
