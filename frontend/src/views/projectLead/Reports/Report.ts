import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import { UserCache } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { CheckboxManager } from '../../../components/checkboxManager/checkboxManager';
import NETWORK from '@/data/network/network';
import { router } from '@/ui_lib/router';
import { CustomTable } from '@/components/table/customTable';

class ReportsView extends View {
  private params: { reportId: string };
  private userCache: UserCache;
  private reports: Report[][] = [];
  private userId: string | null = null;
  private userType: string | null = null;

  private static readonly TABLE_HEADERS = ['ID', 'Project ID', 'Severity', 'Title', 'Vulnerability Type', 'Created At'];
  private static readonly FILTER_OPTIONS = ['Critical', 'High', 'Medium', 'Low', 'Informational'];

  constructor(params: { reportId: string }) {
    super();
    this.params = params;
    this.userCache = CACHE_STORE.getUser();
    // this.reportsCache = CACHE_STORE.getReports();
  }

  private async loadReports(): Promise<void> {
    try {
      const user = await this.userCache.get();
      this.userId = user.id;
      this.userType = user.type;

      this.reports = (await NETWORK.get(`/api/fetch-all-reports/${user.type}/${user.id}`)).data.reports;
      // this.reports = await this.reportsCache.get(false, this.userId);
    } catch (error) {
      console.error('Failed to load report data:', error);
    }
  }

  private renderReportSection(q: Quark, title: string, reports: Report[][]): void {
    const collapsible = new CollapsibleBase(title, '');
    collapsible.render(q);

    // const table = new ColoredFilterableTable(reports, ReportsView.TABLE_HEADERS, {}, 'status', '');
    const table = new CustomTable({
      content: reports,
      headers: ReportsView.TABLE_HEADERS,
      className: 'table-reports',
      options: {
        filteredField: 'severity',
        falseKeys: [],
        noDataMessage: 'No reports to show',
        callback: (report) => {
          router.navigateTo(`/reports/vulnerability/${report.projectId}/${report.reportId}`);
        },
        cellClassNames: {
          4: 'text-small',
          5: 'text-small',
        },
        orderKeys: ['reportId', 'projectId', 'severity', 'title', 'vulnerabilityType', 'createdAt'],
      },
    });
    $(collapsible.getContent(), 'div', 'filter-bar py-1', {}, (q) => {
      $(q, 'span', 'filter-bar-title', {}, 'Filter:');
      const checkboxManager = new CheckboxManager(ReportsView.FILTER_OPTIONS, (checkboxValues) => {
        table.updateRows(checkboxValues);
      });
      checkboxManager.render(q);
    });
    table.render(collapsible.getContent());
  }

  async render(q: Quark): Promise<void> {
    await this.loadReports();
    q.innerHTML = '';

    $(q, 'div', 'd-flex flex-column container mt-8', {}, (q) => {
      $(q, 'div', 'd-flex flex-column container p-4', {}, (q) => {
        const pendingReports = this.reports.filter((report: any) => ['Pending'].includes(report.status));
        // console.log(pendingReports);
        const processedReports = this.reports.filter((report: any) => ['Validated', 'Rejected', 'More Info'].includes(report.status));
        // console.log(processedReports);
        $(q, 'div', 'd-flex flex-column align-items-center', {}, (q) => {
          this.renderReportSection(q, 'Pending Reports', pendingReports);
          this.renderReportSection(q, 'Past Reports', processedReports);
        });
      });
    });
  }
}

export const reportsViewHandler = new ViewHandler('reports', ReportsView);
