import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
// import { ClickableTable } from '@/components/table/clickable.table';
import { PopupTable, ContentItem } from '@components/table/popup.lite.table';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { confirmPromoteToLead } from './confirmPopup';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { Button } from '@/components/button/base';

export class ListValidators extends View {
  private validatorsTableContent: ContentItem[] = [];
  // private confirmPopup: (params: any) => void;

  params: any;
  validators: any;
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
    if (!this.validators || this.validators.length == 0) return;
    for (const validator of this.validators) {
      try {
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
      } catch (error) {
        console.error(`Failed to get validator info for ${validator.userId}:`, error);
      }
    }
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';

    await this.getValidators();
    await this.loadValidators(q);

    $(q, 'div', 'list-validators py-2 d-flex flex-column align-items-center', {}, (q) => {
      if (!this.validators) {
        $(q, 'h1', 'list-validators-title', {}, 'No validators found');
        return;
      }

      $(q, 'h1', 'list-validators-title text-center', {}, 'Validators List');
      $(q, 'div', 'promote-to-lead-table container', {}, (q) => {
        const requestsTable = new PopupTable(this.validatorsTableContent, ['Id', 'Name', 'Email', 'Actions']);
        requestsTable.render(q);
      });
    });
  }
}

export const listValidatorsViewHandler = new ViewHandler('/list-validators', ListValidators);
