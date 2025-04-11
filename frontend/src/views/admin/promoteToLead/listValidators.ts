import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
import { PopupTable, ContentItem } from '@components/table/popup.lite.table';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { confirmPromoteToLead } from './confirmPopup';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { Button } from '@/components/button/base';

export class ListValidators extends View {
  private validatorsTableContent: ContentItem[] = [];
  private validatorsTableContainer!: HTMLElement;

  params: any;
  validators: any;
  container!: HTMLElement;
  constructor(params: any) {
    super();
    this.params = params;
  }

  async getValidators(): Promise<any> {
    try {
      const response = await NETWORK.get('/api/admin/promoteToLead/', { showLoading: true });
      this.validators = response.data.validatorData;
    } catch (error: any) {
      setContent(modalAlertForErrors, {
        '.modal-title': 'Error',
        '.modal-message': `Failed to get validators: ${error.message ?? 'N/A'} `,
        '.modal-data': error.data ?? '',
        '.modal-servletClass': error.servlet ?? '',
        '.modal-url': error.uri ?? '',
      });
      ModalManager.show('alertForErrors', modalAlertForErrors);
    }
  }

  private async loadValidators(q: Quark): Promise<void> {
    for (const validator of this.validators) {
      console.log(`Validator Info for ${validator.userId}:`, validator);
      const popupElement = new confirmPromoteToLead({ userId: validator.userId });
      this.validatorsTableContent.push({
        id: validator.userId,
        Name: validator.name,
        Email: validator.email,
        button: new Button({
          label: 'Promote to Lead',
          onClick: () => {
            popupElement.render(q);
          },
        }),
      });
    }
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';

    $(q, 'div', 'list-validators py-2 d-flex flex-column align-items-center container', {}, (q) => {
      $(q, 'h1', 'list-validators-title text-center', {}, 'Validators List');
      this.container = $(q, 'div', 'promote-to-lead-table container', {}, (q) => {
        this.validatorsTableContainer = $(q, 'div', 'promote-to-lead-no-validators text-center sub-heading-3 bg-secondary container p-2 text-default', {}, 'Loading validators...');
      });
    });

    await this.getValidators();
    if (this.validators && this.validators.length > 0) {
      console.log(this.validators);
      await this.loadValidators(q);
      this.renderValidatorsTable(q);
    } else {
      console.log('No validators found');
      this.validatorsTableContainer.innerHTML = 'No validators found';
    }
  }

  private renderValidatorsTable(q: Quark): void {
    console.log('this.validatorsTableContent', this.validatorsTableContent);
    if (this.validatorsTableContent.length > 0) {
      this.container.innerHTML = '';
      const requestsTable = new PopupTable(this.validatorsTableContent, ['Id', 'Name', 'Email', 'Actions']);
      requestsTable.render(this.container);
    }
  }
}

export const listValidatorsViewHandler = new ViewHandler('/list-validators', ListValidators);
