import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
import { ClickableTable } from '@/components/table/clickable.table';

export class ValidatorApplications extends View {
  params: any;
  applications: any;
  constructor(params: any) {
    super();
    this.params = params;
  }

  async getApplications(): Promise<any> {
    const response = await NETWORK.get('/api/admin/validatorApplications', { showLoading: true });
    return response.data.validators.map((validator: any) => ({
      id: validator.userId,
      name: validator.name,
      email: validator.email,
    }));
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    this.applications = await this.getApplications();
    console.log('applications: ', this.applications);

    $(q, 'div', 'validator-applications', {}, (q) => {
      $(q, 'h1', 'validator-applications-title', {}, 'Validator Applications');

      $(q, 'div', 'validator-applications-table', {}, (q) => {
        const requestsTable = new ClickableTable(this.applications, ['Name', 'Email'], 'requestsTable', (id: number) => {
          console.log('id: ', id);
        });
        requestsTable.render(q);
      });
    });
  }
}

export const validatorApplicationsViewHandler = new ViewHandler('/validator-applications', ValidatorApplications);
