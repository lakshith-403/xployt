import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './Reports.scss';
import { Report, ReportsCache } from '../../../data/projectLead/cache/reports.cache';
import { UserCache } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { ColoredFilterableTable } from '../../../components/table/colored.filterable.table';
import { CheckboxManager } from '../../../components/checkboxManager/checkboxManager';

class ReportsView extends View {
  private params: { reportId: string };
  private reportsCache: ReportsCache;
  private userCache: UserCache;
  private reports: Report[][] = [];
  private userId: number | null = null;

  private static readonly TABLE_HEADERS = ['ID', 'Status', 'Title', 'Client', 'Pending Reports'];
  private static readonly FILTER_OPTIONS = ['pending', 'closed', 'in progress'];

  constructor(params: { reportId: string }) {
    super();
    this.params = params;
    this.userCache = CACHE_STORE.getUser();
    this.reportsCache = CACHE_STORE.getReports();
  }

  private async loadReports(): Promise<void> {
    try {
      const user = await this.userCache.get();
      this.userId = user.id;
      this.reports = await this.reportsCache.get(false, this.userId);
    } catch (error) {
      console.error('Failed to load report data:', error);
    }
  }

  private renderReportSection(q: Quark, title: string, reports: Report[]): void {
    const collapsible = new CollapsibleBase(title, '');
    collapsible.render(q);

    const table = new ColoredFilterableTable(reports, ReportsView.TABLE_HEADERS, {}, 'status', '');

    $(collapsible.getContent(), 'div', 'filter-bar', {}, (q) => {
      $(q, 'span', 'filter-bar-title', {}, 'Filter:');
      const checkboxManager = new CheckboxManager(ReportsView.FILTER_OPTIONS, (checkboxValues) => {
        table.updateRows(checkboxValues);
      });
      checkboxManager.render(q);
    });
    table.render(collapsible.getContent());
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();
    await this.loadReports();
    loading.hide();

    $(q, 'div', 'projects projectLead', {}, (q) => {
      const pendingReports = this.reports[0]!;
      const completedReports = this.reports[1]!;

      this.renderReportSection(q, 'Pending Reports', pendingReports);
      this.renderReportSection(q, 'Completed Reports', completedReports);
    });
  }
}

export const reportsViewHandler = new ViewHandler('reports', ReportsView);
