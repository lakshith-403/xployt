import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
// import { ClickableTable } from '@/components/table/clickable.table';
import { PopupTable, ContentItem } from '@components/table/popup.clickable.table';
import { ApplicationPopup } from './applicationPopup';
import { Popup } from '@components/popup/popup.base';

export class ValidatorApplications extends View {
  private applicationsTableContent: ContentItem[] = [];
  private ApplicationsPopup: (params: any) => Promise<HTMLElement>;

  params: any;
  applications: any;
  constructor(params: any) {
    super();
    this.params = params;
    this.ApplicationsPopup = async (params: any) => {
      const popup = new ApplicationPopup(params);
      return await popup.render();
    };
  }

  async getApplications(): Promise<any> {
    const response = await NETWORK.get('/api/admin/validatorApplications', { showLoading: true });
    console.log('response: ', response);
    // return response.data.validators.map((validator: any) => ({
    //   id: validator.userId,
    //   name: validator.name,
    //   email: validator.email,
    // }));
  }

  private async loadApplications(): Promise<void> {
    for (const application of this.applications) {
      try {
        console.log(`Project Info for ${application.projectId}:`, application);
        const popupElement = await this.ApplicationsPopup({ projectId: application.projectId });
        // this.applicationsTableContent.push({
        //   id: application.projectId,

        //   Date: application.timestamp,
        //   title: application.title,
        //   startDate: application.startDate,
        //   popup: new Popup(popupElement),
        // });
      } catch (error) {
        console.error(`Failed to load project info for ${application.projectId}:`, error);
      }
    }
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    await this.getApplications();
    await this.loadApplications();
    console.log('applications: ', this.applications);

    $(q, 'div', 'validator-applications', {}, (q) => {
      $(q, 'h1', 'validator-applications-title', {}, 'Validator Applications');

      $(q, 'div', 'validator-applications-table', {}, (q) => {
        const requestsTable = new PopupTable(this.applicationsTableContent, ['Name', 'Email']);
        requestsTable.render(q);
      });
    });
  }
}

export const validatorApplicationsViewHandler = new ViewHandler('/validator-applications', ValidatorApplications);
