import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
// import { ClickableTable } from '@/components/table/clickable.table';
import { PopupTable, ContentItem } from '@components/table/popup.clickable.table';
import { Popup } from '@components/popup/popup.base';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { confirmPromoteToLead } from './confirmPopup';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';

export class ListValidators extends View {
  private validatorsTableContent: ContentItem[] = [];
  private confirmPopup: (params: any) => Promise<HTMLElement>;

  params: any;
  validators: any;
  constructor(params: any) {
    super();
    this.params = params;
    this.confirmPopup = async (params: any) => {
      const popup = new confirmPromoteToLead(params);
      return await popup.render();
    };
  }

  async getValidators(): Promise<any> {
    try {
      const response = await NETWORK.get('/api/admin/promoteToValidator/', { showLoading: true });
      this.validators = response.data.validatorData;
      console.log('response: ', response);
    } catch (error: any) {
      console.log('error: ', error);
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

  private async loadValidators(): Promise<void> {
    for (const validator of this.validators) {
      try {
        console.log(`Validator Info for ${validator.userId}:`, validator);
        const popupElement = await this.confirmPopup({ userId: validator.userId });
        this.validatorsTableContent.push({
          id: validator.userId,
          Name: validator.name,
          Email: validator.email,
          popup: new Popup(popupElement),
        });
      } catch (error) {
        console.error(`Failed to get validator info for ${validator.userId}:`, error);
      }
    }
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';

    await this.getValidators();
    console.log('validators: ', this.validators);

    if (!this.validators) {
      $(q, 'div', 'list-validators', {}, (q) => {
        $(q, 'h1', 'list-validators-title', {}, 'No validators found');
      });
      return;
    }

    await this.loadValidators();

    $(q, 'div', 'list-validators', {}, (q) => {
      $(q, 'h1', 'list-validators-title', {}, 'Validators List');

      $(q, 'div', 'promote-to-lead-table', {}, (q) => {
        const requestsTable = new PopupTable(this.validatorsTableContent, ['Id', 'Name', 'Email', 'Actions']);
        requestsTable.render(q);
      });
    });
  }
}

export const listValidatorsViewHandler = new ViewHandler('/list-validators', ListValidators);
