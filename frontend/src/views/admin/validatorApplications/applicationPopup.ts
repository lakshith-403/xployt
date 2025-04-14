import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import NETWORK from '@/data/network/network';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { router } from '@/ui_lib/router';
import { PopupLite } from '@components/popup/popup-lite';

export class ApplicationPopup {
  private readonly userId: string;
  private application: any;
  private renderFunction: (q: Quark) => Promise<void>;
  private popup: PopupLite;

  constructor(params: { userId: string; renderFunction: (q: Quark) => Promise<void> }) {
    this.userId = params.userId;
    this.renderFunction = params.renderFunction;
    this.popup = new PopupLite();
  }

  async loadData(): Promise<void> {
    try {
      const response = await NETWORK.get(`/api/admin/applicationData/${this.userId}`);
      this.application = response.data.applicationData[0];
      console.log('application data: ', this.application);
    } catch (error: any) {
      console.error('Failed to load project data', error);
      throw error;
    }
  }

  async render(parent: HTMLElement): Promise<void> {
    try {
      await this.loadData();
    } catch (error) {
      console.error('Failed to load application data', error);
      return;
    }

    this.popup.render(parent, (q) => {
      $(q, 'div', 'heading', {}, (q) => {
        $(q, 'h3', '', {}, 'Applicant Details');
      });

      $(q, 'div', 'applicant-details', {}, (q) => {
        $(q, 'p', '', {}, `First Name: ${this.application.firstName}`);
        $(q, 'p', '', {}, `Last Name: ${this.application.lastName}`);
        $(q, 'p', '', {}, `Email: ${this.application.email}`);
        $(q, 'p', '', {}, `Mobile: ${this.application.phone}`);
        $(q, 'p', '', {}, `LinkedIn: ${this.application.linkedIn ? this.application.linkedIn : 'Not provided'}`);
        $(q, 'p', '', {}, `Date of Birth: ${this.application.dob}`);
      });

      $(q, 'ul', '', {}, (q) => {});
      $(q, 'div', 'buttons d-flex flex-row gap-2', {}, (q) => {
        new IconButton({
          type: ButtonType.PRIMARY,
          icon: 'fa-solid fa-check',
          label: 'Accept Application',
          onClick: async () => {
            console.log('Accept Application');
            try {
              await NETWORK.post(`/api/admin/validatorApplications`, { userId: this.userId, status: 'active' }, { showLoading: true });
              setContent(modalAlertOnlyOK, {
                '.modal-title': 'Success',
                '.modal-message': 'Application accepted successfully',
              });
              ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(async () => {
                NETWORK.invalidateCache('/api/admin/validatorApplications');
                this.popup.close();
                this.renderFunction(q);
              });
            } catch (error: any) {
              console.error('Failed to accept application', error);
              NETWORK.invalidateCache('/api/admin/validatorApplications');
              this.popup.close();
              this.renderFunction(q);
            }
          },
        }).render(q);
        new IconButton({
          type: ButtonType.TERTIARY,
          icon: 'fa-solid fa-times',
          label: 'Reject Application',
          onClick: async () => {
            console.log('Reject Application');
            try {
              await NETWORK.post(`/api/admin/validatorApplications`, { userId: this.userId, status: 'rejected' });
              setContent(modalAlertOnlyOK, {
                '.modal-title': 'Success',
                '.modal-message': 'Application rejected successfully',
              });
              ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(async () => {
                NETWORK.invalidateCache('/api/admin/validatorApplications');
                this.popup.close();
                this.renderFunction(q);
              });
            } catch (error: any) {
              console.error('Failed to reject application', error);
              NETWORK.invalidateCache('/api/admin/validatorApplications');
              this.popup.close();
              this.renderFunction(q);
            }
          },
        }).render(q);
      });
    });
  }
}
