import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
import { PopupTable, ContentItem } from '@components/table/popup.lite.table';
import { ApplicationPopup } from './applicationPopup';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { Button } from '@/components/button/base';
export class ValidatorApplications extends View {
  private applicationsTableContent: ContentItem[] = [];

  params: any;
  applications: any;
  constructor(params: any) {
    super();
    this.params = params;
  }

  async getApplications(): Promise<any> {
    try {
      const response = await NETWORK.get('/api/admin/validatorApplications', { showLoading: true });
      this.applications = response.data.validators;
      console.log('response: ', response);
    } catch (error: any) {
      console.log('error: ', error);
      setContent(modalAlertForErrors, {
        '.modal-title': 'Error',
        '.modal-message': `Failed to get applications: ${error.message ?? 'N/A'} `,
        '.modal-data': error.data ?? '',
        '.modal-servletClass': error.servlet ?? '',
        '.modal-url': error.uri ?? '',
      });
      ModalManager.show('alertForErrors', modalAlertForErrors);
    }
  }

  private async loadApplications(q: Quark): Promise<void> {
    if (!this.applications || this.applications.length == 0) return;
    for (const application of this.applications) {
      try {
        console.log(`Project Info for ${application.projectId}:`, application);
        const popupElement = new ApplicationPopup({ userId: application.userId });

        this.applicationsTableContent.push({
          id: application.userId,
          Name: application.name,
          Email: application.email,
          Date: application.createdAt,
          button: new Button({
            label: 'View Application',
            onClick: () => {
              popupElement.render(q);
            },
          }),
        });
      } catch (error) {
        console.error(`Failed to load project info for ${application.userId}:`, error);
      }
    }
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    await this.getApplications();
    if (!this.applications) return;
    await this.loadApplications(q);

    console.log('applications: ', this.applications);

    $(q, 'div', 'validator-applications', {}, (q) => {
      $(q, 'h1', 'validator-applications-title', {}, 'Validator Applications');

      $(q, 'div', 'validator-applications-table', {}, (q) => {
        const requestsTable = new PopupTable(this.applicationsTableContent, ['Id', 'Name', 'Email', 'Date', 'Actions']);
        requestsTable.render(q);
      });
    });
  }
}

export const validatorApplicationsViewHandler = new ViewHandler('/validator-applications', ValidatorApplications);
