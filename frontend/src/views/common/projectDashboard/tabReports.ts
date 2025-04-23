import { CACHE_STORE } from '@/data/cache';
import { User, UserCache } from '@data/user';
import { UserType } from '@data/user';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import { router } from '@/ui_lib/router';
import NETWORK from '@/data/network/network';
import { BREADCRUMBS } from '@/components/breadCrumbs/breadCrumbs';
import { CustomTable } from '@/components/table/customTable';
import { CheckboxManager } from '@/components/checkboxManager/checkboxManager';
import { Button, ButtonType } from '@/components/button/base';
export default class ReportsTab {
  private projectState: string;
  private currentUser: User | null;
  private userRole: string;
  private tableContainer!: Quark;
  private filterOptions: string[] = ['Critical', 'High', 'Medium', 'Low', 'Informational'];

  constructor(private readonly projectId: string) {
    this.projectState = '';
    this.currentUser = null;
    this.userRole = '';
  }

  async loadData(): Promise<void> {
    const currentUser = await CACHE_STORE.getUser().get();
    this.currentUser = currentUser;
    this.userRole = currentUser.type;

    const projectData = await NETWORK.get(`/api/single-project/${this.projectId}?role=${this.userRole}`).then((response) => {
      return response.data.project;
    });
    this.projectState = projectData.state;
    console.log('projectData: ', projectData);
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();
    if (this.projectState in ['Active', 'Completed', 'Closed']) {
      $(q, 'div', 'bg-secondary px-2 py-1 text-light-green rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
        $(q, 'span', '', {}, 'Nothing to show here yet');
      });
    } else {
      $(q, 'div', 'bg-secondary rounded w-100 d-flex align-items-center justify-content-start flex-column rounded-3 border-secondary-thick', { style: 'overflow-y: hidden;' }, (q) => {
        // Left side div (1/4 of the space)
        $(q, 'div', 'd-flex align-items-center justify-content-start w-100 text-light-green', {}, (q) => {
          $(q, 'span', 'text-center py-1 border-bottom-1 w-100 h-min-4 col-3', {}, 'Bug Reports Types');
          $(q, 'span', 'text-center py-1 border-bottom-1 w-100 h-min-4 col-9', {}, 'Reports List');
        });

        $(q, 'div', 'w-100 d-flex', {}, (q) => {
          $(q, 'div', 'col-3 d-flex flex-column align-items-center justify-content-start border-right-1', {}, (q) => {
            if (['ProjectLead', 'Client', 'Hacker', 'Validator', 'Admin'].includes(this.userRole)) {
              $(q, 'span', 'd-flex align-items-center justify-content-center flex-column w-100', {}, (q) => {
                const reportActions = [
                  { title: 'Accepted Reports', id: 'Validated', action: () => this.fetchAndDisplayReports(this.userRole, this.projectId, 'Validated') },
                  { title: 'Rejected Reports', id: 'Rejected', action: () => this.fetchAndDisplayReports(this.userRole, this.projectId, 'Rejected') },
                  { title: 'Pending Reports', id: 'Pending', action: () => this.fetchAndDisplayReports(this.userRole, this.projectId, 'Pending') },
                  { title: 'Need More Info Reports', id: 'More Info', action: () => this.fetchAndDisplayReports(this.userRole, this.projectId, 'More Info') },
                ];

                reportActions.forEach((item, index) => {
                  $(
                    q,
                    'span',
                    'text-center w-100 p-2 text-primary cursor-pointer report-buttons hover-bg-tertiary' + (index < reportActions.length - 1 ? ' border-bottom-1' : ''),
                    {
                      onclick: () => item.action(),
                      id: item.id,
                    },
                    item.title
                  );
                });
              });
            } else {
              $(q, 'span', 'text-center', {}, 'No actions available');
            }
          });

          // Right side div (3/4 of the space)
          $(q, 'div', 'col-9 d-flex flex-column align-items-center justify-content-start', {}, (q) => {
            this.tableContainer = $(q, 'div', 'px-2 pt-1 w-100 d-flex flex-column align-items-center justify-content-start gap-2', { style: 'height: 100%', id: 'reports-table' }, (q) => {});
          });
        });
      });

      if (this.userRole === 'ProjectLead') {
        const buttonConfig = {
          Completed: { label: 'Create Project Report', path: `/lead/projects/${this.projectId}/lead-report` },
          Active: { label: 'Create Project Report', path: `/lead/projects/${this.projectId}/lead-report` },
          Closed: { label: 'View Project Report', path: `/lead/projects/${this.projectId}/lead-report` },
        };

        if (buttonConfig[this.projectState as keyof typeof buttonConfig]) {
          $(q, 'div', 'w-100 d-flex align-items-center justify-content-end mt-2', {}, (q) => {
            new Button({
              type: ButtonType.SECONDARY,
              label: buttonConfig[this.projectState as keyof typeof buttonConfig].label,
              onClick: () => {
                router.navigateTo(buttonConfig[this.projectState as keyof typeof buttonConfig].path);
              },
            }).render(q);
          });
        }
      }
    }

    // Click on Accepted Reports by default when the tab is rendered
    this.fetchAndDisplayReports(this.userRole, this.projectId, 'Validated');
  }

  /**
   * Fetches and displays reports based on user role and project ID
   * @param roleName The role of the user (ProjectLead, Client, Hacker, Validator)
   * @param projectId The ID of the project to fetch reports for
   */
  async fetchAndDisplayReports(roleName: string, projectId: string, status: string): Promise<void> {
    // First, remove bg-primary from all report buttons
    document.querySelectorAll('.report-buttons').forEach((button) => {
      button.classList.remove('bg-primary');
      button.classList.add('bg-secondary');
    });

    // Then add bg-primary to the selected button
    document.getElementById(status)?.classList.add('bg-primary');
    document.getElementById(status)?.classList.remove('bg-secondary');
    try {
      // Empty container first
      if (this.tableContainer) {
        this.tableContainer.innerHTML = '';
      }

      // Show loading indicator
      if (this.tableContainer) {
        $(this.tableContainer, 'div', 'text-center py-2', {}, (q) => {
          $(q, 'span', 'text-primary', {}, 'Loading reports...');
        });
      }

      // TODO: Fetch data based on role and projectId
      // This part is intentionally left empty as requested

      // Clear loading indicator
      if (this.tableContainer) {
        this.tableContainer.innerHTML = '';
      }

      // Display the fetched data
      if (this.tableContainer) {
        $(this.tableContainer, 'div', 'w-100', {}, async (q) => {
          if (['ProjectLead', 'Client', 'Hacker', 'Validator', 'Admin'].includes(roleName)) {
            const response = await NETWORK.get(`/api/fetch-reports/${roleName}/${projectId}/${status}/${this.currentUser?.id}`, { localLoading: true, elementId: 'reports-table' });
            const reports = response.data.reports;
            const TABLE_HEADERS = ['Report Id', 'Severity', 'Vulnerability Type', 'Title', 'Created At'];
            const table = new CustomTable({
              content: reports,
              headers: TABLE_HEADERS,
              className: 'w-100 border-text-primary-extra-thin overflow-hidden',
              options: {
                filteredField: 'severity',
                falseKeys: [],
                noDataMessage: 'No reports to show',
                lastLine: false,
                callback: (report) => {
                  router.navigateTo(`/reports/vulnerability/${this.projectId}/${report.reportId}`);
                },
                orderKeys: ['reportId', 'severity', 'vulnerabilityType', 'title', 'createdAt'],
                cellClassNames: {
                  2: 'text-small',
                  3: 'text-small',
                },
              },
            });
            const checkboxManager = new CheckboxManager(this.filterOptions, (checkboxValues) => {
              table.updateRows(checkboxValues);
            });
            checkboxManager.render(q);
            table.render(this.tableContainer);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching reports:', error);

      // Show error message
      if (this.tableContainer) {
        this.tableContainer.innerHTML = '';
        $(this.tableContainer, 'div', 'text-center py-2', {}, (q) => {
          $(q, 'span', 'text-danger', {}, 'Failed to load reports. Please try again.');
        });
      }
    }
  }
}
