import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { CACHE_STORE } from '@data/cache';
import { ReportsCache } from '@data/projectLead/cache/reports.cache';
import { UserCache } from '@data/user';
import { tableBase } from '@components/table/table.base';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import '../../tabOverview.scss';

export class OverviewReports {
  private params: { reportId: string };
  private reportsCache: ReportsCache;
  private userCache: UserCache;
  // todo: retrieve from backend
  private reports: { id: number; status: string; title: string; date: string }[] = [
    {
      id: 1,
      status: 'Pending',
      title: 'Report 1',
      date: '2021-10-10',
    },
    {
      id: 2,
      status: 'Approved',
      title: 'Report 2',
      date: '2021-10-11',
    },
    {
      id: 3,
      status: 'Rejected',
      title: 'Report 3',
      date: '2021-10-12',
    },
  ];
  private userId: string | null = null;

  constructor(params: { reportId: string }) {
    this.params = params;
    this.userCache = CACHE_STORE.getUser();
    this.reportsCache = CACHE_STORE.getReports();
  }

  private async loadReports(): Promise<void> {
    try {
      const user = await this.userCache.get();
      this.userId = user.id;
      // this.reports = await this.reportsCache.get(false, this.userId);
      console.log(this.reports);
    } catch (error) {
      console.error('Failed to load report data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    // const loading = new LoadingScreen(q);
    // loading.show();
    // await this.loadReports();
    // loading.hide();

    $(q, 'div', '', {}, (q) => {
      new tableBase(this.reports, ['ID', 'Status', 'Title', 'Date']).render(q);
    });
  }
}
