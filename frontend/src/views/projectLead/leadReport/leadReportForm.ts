import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
import { UIManager } from '@/ui_lib/UIManager';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { CustomTable } from '@/components/table/customTable';
import { UserCache } from '@/data/user';
import { CACHE_STORE } from '@/data/cache';

class LeadReportForm extends View {
  params: { projectId: string; configured: string };
  configured: boolean;
  projectInfo: any;
  user: any;
  userCache!: UserCache;
  userId!: string;

  protected shouldRenderBreadcrumbs(): boolean {
    return true;
  }

  protected setupBreadcrumbs(params: { projectId: string; configured: string }): void {
    this.breadcrumbs?.clearBreadcrumbs();
    this.breadcrumbs?.addBreadcrumb({
      label: `Projects`,
      link: `/projects`,
    });
    this.breadcrumbs?.addBreadcrumb({
      label: `Project #${params.projectId}`,
      link: `/projects/${params.projectId}`,
    });
    this.breadcrumbs?.addBreadcrumb({
      label: `Lead Report`,
      link: `/projects/${params.projectId}/lead-report`,
    });
  }
  constructor(params: { projectId: string; configured: string }) {
    super(params);
    this.params = params;
    this.configured = /true/.test(params.configured);
    this.projectInfo = null;
    console.log('params', params);
  }

  private async loadData(): Promise<void> {
    this.userCache = CACHE_STORE.getUser();
    const user = await this.userCache.get();
    this.userId = user.id;
  }

  private onSubmit: (formState: any) => void = async (formState: any) => {};
  private sectionClases = 'container-lg h-min-15 p-1 bg-secondary rounded-3 overflow-hidden';

  async render(q: Quark): Promise<void> {
    await this.loadData();
    $(q, 'div', 'container d-flex flex-column gap-1', {}, (q) => {
      $(q, 'h1', 'sub-heading-1', {}, 'Lead Report');

      $(q, 'section', this.sectionClases, { id: 'lr-project-info' }, async (q) => {
        $(q, 'h2', 'sub-heading-2 text-light-green', {}, 'Project Info');
        this.projectInfo = (
          await NETWORK.get(`/api/single-project/${this.params.projectId}?role=ProjectLead`, {
            localLoading: true,
            elementId: 'lr-project-info',
          })
        ).data.project;
        UIManager.listObjectGivenKeys(q, this.projectInfo, ['startDate', 'endDate', 'description', 'technicalStack', 'state'], { className: 'd-flex flex-column gap-1' });
      });

      $(q, 'section', this.sectionClases, { id: 'lr-hacker-info' }, async (q) => {
        $(q, 'h2', 'sub-heading-2 text-light-green', {}, 'Hacker Info');
        while (!this.projectInfo) {
          LoadingScreen.showLocal('lr-hacker-info');
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        LoadingScreen.hideLocal('lr-hacker-info');
        UIManager.listObjectGivenKeys(q, this.projectInfo, ['noOfHackers'], { className: 'd-flex flex-column gap-1' });
      });

      $(q, 'section', this.sectionClases, { id: 'lr-validator-info' }, async (q) => {
        $(q, 'h2', 'sub-heading-2 text-light-green', {}, 'Validator Info');
        while (!this.projectInfo) {
          LoadingScreen.showLocal('lr-validator-info');
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        LoadingScreen.hideLocal('lr-validator-info');
        UIManager.listObjectGivenKeys(q, this.projectInfo, ['noOfValidators'], { className: 'd-flex flex-column gap-1' });
      });

      $(q, 'section', this.sectionClases, { id: 'lr-reports-info' }, async (q) => {
        $(q, 'h2', 'sub-heading-2 text-light-green', {}, 'Project Info');

        const reportsResponse = (
          await NETWORK.get(`/api/common/paymentInfo/${this.params.projectId}?role=ProjectLead&userId=${this.userId}`, {
            localLoading: true,
            elementId: 'lr-reports-info',
          })
        ).data.payments;

        const tableData = reportsResponse.map((report: any) => ({
          severity: report.level,
          amount: report.amount,
          reports: report.reportCount,
          bugType: report.items.split(',').join('\n\n'),
        }));
        new CustomTable({
          content: tableData,
          headers: ['Severity', 'Amount', 'Reports', 'Bug Type'],
          className: 'table-payments w-100',
          options: {
            filteredField: 'severity',
            falseKeys: [],
            noDataMessage: 'No payment levels configured',
            cellClassName: 'd-flex justify-content-center align-items-center',
            cellClassNames: {
              3: 'd-flex justify-content-center align-items-center text-small',
            },
          },
        }).render(q);
      });

      $(q, 'section', this.sectionClases, { id: 'lr-payment-info' }, (q) => {});

      $(q, 'section', this.sectionClases, { id: 'lr-conflicts-info' }, (q) => {});

      $(q, 'section', this.sectionClases, { id: 'lr-recommendations-info' }, (q) => {});
    });
  }
}

export const leadReportFormViewHandler = new ViewHandler('/projects/{projectId}/lead-report', LeadReportForm);
