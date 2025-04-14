import { QuarkFunction as $ } from '@ui_lib/quark';
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
    } catch (error: any) {
      console.error('Failed to load project data', error);
      setContent(modalAlertForErrors, {
        '.modal-title': 'Error',
        '.modal-message': `Failed to load project data: ${error.message ?? 'N/A'} `,
        '.modal-data': error.data ?? 'Data not available',
        '.modal-servletClass': error.servlet ?? 'Servlet not available',
        '.modal-url': error.url ?? 'URL not available',
      });
      ModalManager.show('alertForErrors', modalAlertForErrors);
      throw error;
    }
  }

  async render(parent: HTMLElement): Promise<void> {
    try {
      await this.loadData();
    } catch (error: any) {
      return;
    }
    const overlay = $(parent, 'div', 'confirm-promote-to-lead position-fixed top-0 left-0 w-100 h-100 d-flex align-items-center bg-opacity-50 justify-content-center', {}, (q) => {
      // Content
      $(q, 'div', 'position-relative mx-auto container-md bg-secondary px-3 py-2 rounded-3', {}, (q) => {
        $(q, 'div', 'heading', {}, (q) => {
          $(q, 'h3', '', {}, 'Validator Details');
        });

        $(q, 'ul', '', {}, (q) => {
          console.log('application fields: ', this.application);
          Object.keys(this.application).forEach((key) => {
            $(q, 'li', '', {}, (q) => {
              $(q, 'span', '', {}, key);
              $(q, 'span', '', {}, this.application[key]);
            });
          });
        });

        $(q, 'div', 'buttons', {}, (q) => {
          new IconButton({
            type: ButtonType.PRIMARY,
            icon: 'fa-solid fa-check',
            label: 'Promote',
            onClick: async () => {
              try {
                await NETWORK.post(`/api/admin/promoteToLead/`, { userId: this.userId, status: 'active' }, { showLoading: true });
                setContent(modalAlertOnlyOK, {
                  '.modal-title': 'Success',
                  '.modal-message': 'Application accepted successfully',
                });
                ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
                  this.closePopup(overlay);
                  window.location.reload();
                });
              } catch (error: any) {
                console.error('Failed to accept application', error);
                setContent(modalAlertForErrors, {
                  '.modal-title': 'Error',
                  '.modal-message': `Failed to promote to lead: ${error.message ?? 'N/A'} `,
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
