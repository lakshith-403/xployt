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

export class ApplicationPopup {
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

  async render(): Promise<HTMLElement> {
    const q = document.createElement('div');
    const loading = new LoadingScreen(q);
    loading.show();

    await this.loadData();
    loading.hide();

    $(q, 'div', 'hacker-application', {}, (q) => {
      $(q, 'div', 'content', {}, (q) => {
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
        $(q, 'div', 'buttons', {}, (q) => {
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
                ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
              } catch (error: any) {
                console.error('Failed to accept application', error);
                setContent(modalAlertForErrors, {
                  '.modal-title': 'Error',
                  '.modal-message': `Failed to accept application: ${error.message ?? 'N/A'} `,
                  '.modal-data': error.data ?? 'Data not available',
                  '.modal-servletClass': error.servlet ?? 'Servlet not available',
                  '.modal-url': error.url ?? 'URL not available',
                });
                ModalManager.show('alertForErrors', modalAlertForErrors);
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
                await NETWORK.post(`/api/admin/validatorApplications`, { userId: this.userId, status: 'rejected' }, { showLoading: true });
                setContent(modalAlertOnlyOK, {
                  '.modal-title': 'Success',
                  '.modal-message': 'Application rejected successfully',
                });
                ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
                  router.navigateTo('/admin/validatorApplications');
                });
              } catch (error: any) {
                console.error('Failed to reject application', error);
                setContent(modalAlertForErrors, {
                  '.modal-title': 'Error',
                  '.modal-message': `Failed to reject application: ${error.message ?? 'N/A'} `,
                  '.modal-data': error.data ?? 'Data not available',
                  '.modal-servletClass': error.servlet ?? 'Servlet not available',
                  '.modal-url': error.url ?? 'URL not available',
                });
                ModalManager.show('alertForErrors', modalAlertForErrors, true).then(async () => {
                  const response = await NETWORK.get('/api/admin/validatorApplications', { showLoading: true, handleError: true });
                  console.log('response: ', response);
                });
              }
            },
          }).render(q);
        });
      });
    });

    return q;
  }
}
