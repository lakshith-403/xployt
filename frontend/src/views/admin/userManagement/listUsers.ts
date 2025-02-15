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
import { DeleteConfirmPopup } from './deleteConfirmPopup';
import { Button } from '@/components/button/base';
import { CollapsibleBase } from '@/components/Collapsible/collap.base';
import { CustomTable } from '@/components/table/customTable';
import { CheckboxManager } from '@/components/checkboxManager/checkboxManager';

export class ListUsers extends View {
  private usersTableContainer!: HTMLElement;
  private TABLE_HEADERS = ['Id', 'Name', 'Email', 'Status', 'View Info', 'Delete User'];
  private static readonly FILTER_OPTIONS_VALIDATORS = ['active', 'pending', 'inactive'];
  private static readonly FILTER_OPTIONS_PROJECT_LEADS = ['active', 'pending', 'inactive'];

  // private confirmPopup: (params: any) => void;

  params: any;
  validators: ContentItem[] = [];
  projectLeads: ContentItem[] = [];
  constructor(params: any) {
    super();
    this.params = params;
  }

  private async fetchAndLoadUsers(q: Quark, type: string): Promise<void> {
    try {
      const response = await NETWORK.get(`/api/admin/userManagement/${type}`, { showLoading: true });
      const users = response.data.users;

      for (const user of users) {
        try {
          // console.log(`User Info for ${user.userId}:`, user);
          const popupElement = new InfoPopup({ userId: user.userId, user: user, userType: type });
          const deleteConfirmPopup = new DeleteConfirmPopup({ userId: user.userId, user: user, userType: type });
          const userData = {
            id: user.userId,
            Name: user.name,
            Email: user.email,
            Status: user.status,
            button: new Button({
              label: 'View Info',
              onClick: () => {
                popupElement.render(q);
              },
            }),
            button2: new Button({
              label: 'Delete User',
              onClick: () => {
                deleteConfirmPopup.render(q);
              },
            }),
          };

          if (type === 'Validator') {
            this.validators.push(userData);
          } else if (type === 'ProjectLead') {
            this.projectLeads.push(userData);
          }
        } catch (error) {
          console.error(`Failed to get user info for ${user.userId}:`, error);
        }
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

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';

    $(q, 'div', 'list-users py-2 d-flex flex-column align-items-center', {}, (q) => {
      if (!this.validators && !this.projectLeads) {
        $(q, 'h1', 'list-users-title', {}, 'No users found');
        return;
      }

      $(q, 'h1', 'list-users-title text-center', {}, 'Users List');
      this.usersTableContainer = $(q, 'div', 'list-users-table container', {}, (q) => {});
    });

    try {
      await this.fetchAndLoadUsers(q, 'Validator');
      if (this.validators.length > 0) {
        this.renderUsersSection(this.usersTableContainer, 'Validators', this.validators, ListUsers.FILTER_OPTIONS_VALIDATORS);
      }
      await this.fetchAndLoadUsers(q, 'ProjectLead');
      if (this.projectLeads.length > 0) {
        this.renderUsersSection(this.usersTableContainer, 'Project Leads', this.projectLeads, ListUsers.FILTER_OPTIONS_PROJECT_LEADS);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  private renderUsersSection(q: Quark, title: string, users: any[], filterOptions: string[]): void {
    $(q, 'h2', 'list-users-title text-center sub-heading-2 my-1', {}, title);
    // console.log('Users:', users);
    const table = new CustomTable({
      content: users,
      headers: this.TABLE_HEADERS,
      className: 'table-users py-1 mb-4',
      options: {
        filteredField: 'Status',
        falseKeys: filterOptions,
        noDataMessage: 'No users to show',
      },
    });

    $(q, 'span', 'filter-bar-title', {}, 'Filter:');
    const checkboxManager = new CheckboxManager(filterOptions, (checkboxValues) => {
      table.updateRows(checkboxValues);
    });
    checkboxManager.render(q);
    table.render(q);
  }
}

export const listUsersViewHandler = new ViewHandler('/list-users', ListUsers);
