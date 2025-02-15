import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
// import { ClickableTable } from '@/components/table/clickable.table';
import { PopupTable, ContentItem } from '@components/table/popup.lite.table';
import { FilterableTable } from '@components/table/filterable.table';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { InfoPopup } from './infoPopup';
import { Button } from '@/components/button/base';
import { CollapsibleBase } from '@/components/Collapsible/collap.base';
import { CustomTable } from '@/components/table/customTable';
import { CheckboxManager } from '@/components/checkboxManager/checkboxManager';

export class ListUsers extends View {
  private usersTableContent: ContentItem[] = [];
  private usersTableContainer!: HTMLElement;
  private TABLE_HEADERS = ['Id', 'Name', 'Email', 'View Info', 'Delete User'];
  private static readonly FILTER_OPTIONS = ['ProjectLead', 'Validator'];

  // private confirmPopup: (params: any) => void;

  params: any;
  validators: any;
  projectLeads: any;
  constructor(params: any) {
    super();
    this.params = params;
  }

  async getUsers(type: string): Promise<any> {
    try {
      const response = await NETWORK.get(`/api/admin/userManagement/${type}`, { showLoading: true });
      if (type === 'Validator') {
        this.validators = response.data.users;
      } else if (type === 'ProjectLead') {
        this.projectLeads = response.data.users;
      }
    } catch (error: any) {
      setContent(modalAlertForErrors, {
        '.modal-title': 'Error',
        '.modal-message': `Failed to get users: ${error.message ?? 'N/A'} `,
        '.modal-data': error.data ?? '',
        '.modal-servletClass': error.servlet ?? '',
        '.modal-url': error.uri ?? '',
      });
      ModalManager.show('alertForErrors', modalAlertForErrors);
      throw error;
    }
  }

  private async loadUsers(q: Quark, type: string): Promise<void> {
    if (!this.validators || this.validators.length == 0) return;
    for (const user of this.validators) {
      try {
        console.log(`User Info for ${user.userId}:`, user);
        const popupElement = new InfoPopup({ userId: user.userId, user: user });
        this.usersTableContent.push({
          id: user.userId,
          Name: user.name,
          Email: user.email,
          button: new Button({
            label: 'View Info',
            onClick: () => {
              popupElement.render(q);
            },
          }),
          button2: new Button({
            label: 'Delete User',
            onClick: () => {
              // this.deleteUser(user.userId);
            },
          }),
        });
      } catch (error) {
        console.error(`Failed to get user info for ${user.userId}:`, error);
      }
    }
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';

    try {
      await this.getUsers('validator');
      await this.loadUsers(q, 'Validator');
      await this.getUsers('projectLead');
      await this.loadUsers(q, 'Project Lead');
    } catch (error) {
      console.error('Failed to load users:', error);
    }

    $(q, 'div', 'list-users py-2 d-flex flex-column align-items-center', {}, (q) => {
      if (!this.validators && !this.projectLeads) {
        $(q, 'h1', 'list-users-title', {}, 'No users found');
        return;
      }

      $(q, 'h1', 'list-users-title text-center', {}, 'Users List');
      $(q, 'div', 'list-users-table container', {}, (q) => {
        this.renderUsersSection(q, 'Validators', this.validators);
        this.renderUsersSection(q, 'Project Leads', this.projectLeads);
      });
    });
  }

  private renderUsersSection(q: Quark, title: string, users: any[]): void {
    const table = new CustomTable({
      content: users,
      headers: this.TABLE_HEADERS,
      className: 'table-users',
      options: {
        filteredField: 'state',
        falseKeys: [],
        noDataMessage: 'No users to show',
      },
    });

    $(q, 'span', 'filter-bar-title', {}, 'Filter:');
    const checkboxManager = new CheckboxManager(ListUsers.FILTER_OPTIONS, (checkboxValues) => {
      table.updateRows(checkboxValues);
    });
    checkboxManager.render(q);
    table.render(q);
  }
}

export const listUsersViewHandler = new ViewHandler('/list-users', ListUsers);
