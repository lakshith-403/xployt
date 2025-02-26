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
  private applicationsTableContainer!: HTMLElement;
  params: any;
  applications: any;
  constructor(params: any) {
    super();
    this.params = params;
  }

  public async getApplications(): Promise<any> {
    try {
      console.log('getting applications');
      const response = await NETWORK.get('/api/admin/validatorApplications');
      this.applications = response.data.validators;
      console.log('response: ', response);
    } catch (error: any) {
      console.log('error: ', error);
    }
  }

  public async loadApplications(q: Quark): Promise<void> {
    console.log('loading applications');
    if (!this.applications || this.applications.length == 0) return;
    for (const application of this.applications) {
      try {
        console.log(`Project Info for ${application.userId}:`, application);
        const popupElement = new ApplicationPopup({
          userId: application.userId,
          renderFunction: (q) => this.renderFunction(q),
        });

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

    console.log('applications: ', this.applications);

    $(q, 'div', 'validator-applications py-2 d-flex flex-column align-items-center container', {}, (q) => {
      $(q, 'h1', 'validator-applications-title text-center heading-1', {}, 'Validator Applications');

      this.applicationsTableContainer = $(q, 'div', 'validator-applications-table-container container', {}, (q) => {
        $(q, 'div', 'validator-applications-no-applications text-center sub-heading-3 bg-secondary container p-2 text-default', {}, 'Loading applications...');
      });
    });

    this.renderFunction(q);
  }

  public async renderFunction(q: Quark): Promise<void> {
    await this.getApplications();
    if (this.applications && this.applications.length > 0) {
      await this.loadApplications(q);
      this.renderApplicationsTable();
    } else {
      this.applicationsTableContainer.innerHTML = 'No applications found';
    }
  }

  private renderApplicationsTable(): void {
    console.log('applicationsTableContent: ', this.applicationsTableContent);
    const requestsTable = new PopupTable(this.applicationsTableContent, ['Id', 'Name', 'Email', 'Date', 'Actions']);
    if (this.applicationsTableContainer) {
      this.applicationsTableContainer.innerHTML = '';
      requestsTable.render(this.applicationsTableContainer);
    }
  }
}

export const validatorApplicationsViewHandler = new ViewHandler('/validator-applications', ValidatorApplications);
