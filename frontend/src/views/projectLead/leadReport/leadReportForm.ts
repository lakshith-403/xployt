import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
import { UIManager } from '@/ui_lib/UIManager';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { CustomTable } from '@/components/table/customTable';
import { UserCache } from '@/data/user';
import { CACHE_STORE } from '@/data/cache';

class LeadReportForm extends View {
  private readonly params: { projectId: string; configured: string };
  private projectInfo: any;
  private userCache!: UserCache;
  private userId!: string;
  private hackerInfo: any;
  private validatorInfo: any;
  private readonly sectionClasses = 'container-lg h-min-15 p-1 bg-secondary rounded-3';

  constructor(params: { projectId: string; configured: string }) {
    super(params);
    this.params = params;
    this.projectInfo = null;
  }

  protected shouldRenderBreadcrumbs(): boolean {
    return true;
  }

  protected setupBreadcrumbs(params: { projectId: string }): void {
    this.breadcrumbs?.clearBreadcrumbs();
    this.breadcrumbs?.addBreadcrumb({ label: 'Projects', link: '/projects' });
    this.breadcrumbs?.addBreadcrumb({
      label: `Project #${params.projectId}`,
      link: `/projects/${params.projectId}`,
    });
    this.breadcrumbs?.addBreadcrumb({
      label: 'Lead Report',
      link: `/projects/${params.projectId}/lead-report`,
    });
  }

  private async loadData(): Promise<void> {
    this.userCache = CACHE_STORE.getUser();
    const user = await this.userCache.get();
    this.userId = user.id;
  }

  private async waitForProjectInfo(elementId: string): Promise<void> {
    while (!this.projectInfo) {
      LoadingScreen.showLocal(elementId);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    LoadingScreen.hideLocal(elementId);
  }

  private createCustomTable(config: { content: any[]; headers: string[]; orderKeys?: string[]; filteredField?: string; noDataMessage: string }): CustomTable {
    return new CustomTable({
      content: config.content,
      headers: config.headers,
      className: 'table-payments w-100',
      options: {
        orderKeys: config.orderKeys,
        filteredField: config.filteredField,
        falseKeys: [],
        noDataMessage: config.noDataMessage,
        cellClassName: 'd-flex justify-content-center align-items-center',
        cellClassNames: {
          1: 'd-flex justify-content-center align-items-center text-small',
        },
      },
    });
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();

    $(q, 'div', 'container d-flex flex-column gap-1 mb-3', {}, (q) => {
      $(q, 'h1', 'sub-heading-1', {}, 'Lead Report');

      // Project Info Section
      $(q, 'section', this.sectionClasses, { id: 'lr-project-info' }, async (q) => {
        $(q, 'h2', 'sub-heading-2 text-light-green', {}, 'Project Info');
        this.projectInfo = (
          await NETWORK.get(`/api/single-project/${this.params.projectId}?role=ProjectLead`, {
            localLoading: true,
            elementId: 'lr-project-info',
          })
        ).data.project;
        UIManager.listObjectGivenKeys(q, this.projectInfo, ['startDate', 'endDate', 'description', 'technicalStack', 'state'], { className: 'd-flex flex-column gap-1' });
      });

      // Hacker Info Section
      $(q, 'section', this.sectionClasses, { id: 'lr-hacker-info' }, async (q) => {
        $(q, 'h2', 'sub-heading-2 text-light-green', {}, 'Project Hackers');
        await this.waitForProjectInfo('lr-hacker-info');
        UIManager.listObjectGivenKeys(q, this.projectInfo, ['noOfHackers'], { className: 'd-flex flex-column gap-1' });

        this.hackerInfo = (
          await NETWORK.get(`/api/lead/stats/${this.params.projectId}/hacker`, {
            localLoading: true,
            elementId: 'lr-hacker-info',
          })
        ).data.reportStats;

        $(q, 'hr', 'my-1', {}, '');
        this.createCustomTable({
          content: this.hackerInfo,
          headers: ['Hacker ID', 'Hacker Name', 'Validated Reports', 'Rejected Reports', 'More Info Reports', 'Assigned Validator'],
          orderKeys: ['hackerId', 'name', 'validatedReports', 'rejectedReports', 'moreInfoReports', 'assignedValidatorId'],
          noDataMessage: 'No hacker reports found',
        }).render(q);
      });

      // Validator Info Section
      $(q, 'section', this.sectionClasses, { id: 'lr-validator-info' }, async (q) => {
        $(q, 'h2', 'sub-heading-2 text-light-green', {}, 'Project Validators');
        await this.waitForProjectInfo('lr-validator-info');
        UIManager.listObjectGivenKeys(q, this.projectInfo, ['noOfValidators'], { className: 'd-flex flex-column gap-1' });

        this.validatorInfo = (
          await NETWORK.get(`/api/lead/stats/${this.params.projectId}/validator`, {
            localLoading: true,
            elementId: 'lr-validator-info',
          })
        ).data.reportStats;

        $(q, 'hr', 'my-1', {}, '');
        this.createCustomTable({
          content: this.validatorInfo,
          headers: ['Validator ID', 'Validator Name', 'Validated Reports', 'Rejected Reports', 'More Info Reports', 'Assigned Hackers'],
          orderKeys: ['assignedValidatorId', 'name', 'validatedReports', 'rejectedReports', 'moreInfoReports', 'assignedHackers'],
          noDataMessage: 'No validator reports found',
        }).render(q);
      });

      // Reports Info Section
      $(q, 'section', this.sectionClasses, { id: 'lr-reports-info' }, async (q) => {
        $(q, 'h2', 'sub-heading-2 text-light-green', {}, 'Report Summary');

        const reportsResponse = (
          await NETWORK.get(`/api/common/paymentInfo/${this.params.projectId}?role=ProjectLead&userId=${this.userId}`, { localLoading: true, elementId: 'lr-reports-info' })
        ).data.payments;

        const tableData = reportsResponse.map((report: any) => ({
          severity: report.level,
          amount: report.amount,
          reports: report.reportCount,
          bugType: report.items.split(',').join('\n\n'),
        }));

        this.createCustomTable({
          content: tableData,
          headers: ['Severity', 'Amount', 'Reports', 'Bug Type'],
          filteredField: 'severity',
          noDataMessage: 'No payment levels configured',
        }).render(q);

        const vulnResponse = (
          await NETWORK.get(`/api/lead/stats/${this.params.projectId}/vuln`, {
            localLoading: true,
            elementId: 'lr-reports-info',
          })
        ).data.reportStats;

        const vulnTableData = vulnResponse.map((report: any) => ({
          vulnerabilityType: report.vulnerabilityType,
          validatedCount: report.validatedCount,
        }));

        this.createCustomTable({
          content: vulnTableData,
          headers: ['Vulnerability Type', 'Bugs Found'],
          noDataMessage: 'No vulnerabilities found',
        }).render(q);
      });

      // Recommendations Section
      $(q, 'section', this.sectionClasses, { id: 'lr-recommendations-info' }, (q) => {
        $(q, 'h2', 'sub-heading-2 text-light-green', {}, 'Recommendations');
      });
    });
  }
}

export const leadReportFormViewHandler = new ViewHandler('/projects/{projectId}/lead-report', LeadReportForm);
