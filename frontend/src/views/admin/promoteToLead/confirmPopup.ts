import { QuarkFunction as $ } from '@ui_lib/quark';
import { CACHE_STORE } from '@data/cache';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import BasicInfoComponent from '@components/basicInfo/basicInfoComponent';
// import './InvitationPopup.scss';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import NETWORK from '@/data/network/network';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { router } from '@/ui_lib/router';

export class confirmPromoteToLead {
  private readonly userId: string;
  private application: any;

  constructor(params: { userId: string }) {
    this.userId = params.userId;
  }

  // async loadData(): Promise<void> {
  //   try {
  //     const response = await NETWORK.get(`/api/admin/applicationData/${this.userId}`, { showLoading: true });
  //     this.application = response.data.applicationData[0];
  //     console.log('application data: ', this.application);
  //   } catch (error) {
  //     console.error('Failed to load project data', error);
  //   }
  // }

  async render(): Promise<HTMLElement> {
    const q = document.createElement('div');
    const loading = new LoadingScreen(q);
    loading.show();

    // await this.loadData();
    loading.hide();

    $(q, 'div', 'confirm-promote-to-lead', {}, (q) => {
      $(q, 'div', 'content', {}, (q) => {
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
              try {
                await NETWORK.post(`/api/admin/promoteToLead`, { userId: this.userId }, { showLoading: true });
                setContent(modalAlertOnlyOK, {
                  '.modal-title': 'Success',
                  '.modal-message': 'Validator promoted successfully',
                });
                ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
              } catch (error: any) {
                console.error('Failed to promote validator', error);
                setContent(modalAlertForErrors, {
                  '.modal-title': 'Error',
                  '.modal-message': `Failed to promote validator: ${error.message ?? 'N/A'} `,
                  '.modal-data': error.data ?? 'Data not available',
                  '.modal-servletClass': error.servlet ?? 'Servlet not available',
                  '.modal-url': error.url ?? 'URL not available',
                });
                ModalManager.show('alertForErrors', modalAlertForErrors);
              }
            },
          }).render(q);
        });
      });
    });

    return q;
  }
}
