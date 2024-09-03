import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './Reports.scss';

// import './../../../components/loadingScreen/loadingScreen.scss';

import { Report, ReportsCache } from '../../../data/projectLead/cache/reports.cache';
import { UserCache, UserCacheMock } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';
import loadingScreen from '../../../components/loadingScreen/loadingScreen';
import { reportsCollabsible } from '../../../components/Collapsible/reportsCollapsible';

class ReportsView implements View {
  params: { reportId: string };
  reportsCache: ReportsCache;
  userCache: UserCache;
  Reports: Report[][] | [][] = [[]];
  userId: number | null = null;

  constructor(params: { reportId: string }) {
    this.params = params;
    this.userCache = CACHE_STORE.getUser('1');
    this.reportsCache = CACHE_STORE.getReports();
    // console.log('param is', params);
  }
  async loadReports(): Promise<void> {
    try {
      this.userId = (await this.userCache.get()).id;
      this.Reports = await this.reportsCache.get(false, this.userId);
    } catch (error) {
      console.error('Failed to load report data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    const loading = new loadingScreen(q);
    loading.show();
    await this.loadReports();
    loading.hide();

    $(q, 'div', 'reports validator', {}, (q) => {
      $(q, 'h2', 'Reports', {}, 'Reports');

      const tableHeader = ['ID', 'Title', 'Client', 'Status', 'Pending Reports'];
      new reportsCollabsible(q, 'On-going Reports', this.Reports[0]!, tableHeader, 'tables');
      new reportsCollabsible(q, 'Completed Reports', this.Reports[1]!, tableHeader, 'tables');

    
    });
  }
}

export const reportViewHandler = new ViewHandler('reports', ReportsView);
