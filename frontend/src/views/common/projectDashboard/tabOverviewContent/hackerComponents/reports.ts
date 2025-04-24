import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { CACHE_STORE } from '@data/cache';
import { ReportsCache } from '@data/projectLead/cache/reports.cache';
import {User, UserCache} from '@data/user';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import '../../tabOverview.scss';
import NETWORK from "@data/network/network";
import {CustomTable} from "@components/table/customTable";
import {router} from "@ui_lib/router";

export class OverviewReports {
  private projectId: string;
  private reportsCache: ReportsCache;
  private userCache: UserCache;
  private tableContainer!: Quark;
  private user!: User;
  private reports: any = null;

  constructor( projectId: string ) {
    this.projectId = projectId;
    this.userCache = CACHE_STORE.getUser();
    this.reportsCache = CACHE_STORE.getReports();
  }

  private async loadReports(): Promise<void> {
    try {
      this.user = await CACHE_STORE.getUser().get();
      console.log('userId: ', this.user);
    } catch (error) {
      console.error('Failed to load report data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();
    await this.loadReports();
    loading.hide();

    $(q, 'div', '', {}, (q) => {
      this.tableContainer = q;
      $(this.tableContainer, 'div', 'w-100', {}, async (q) => {
          const response = await NETWORK.get(`/api/fetch-reports/Hacker/${this.projectId}/Pending/${this.user.id}`);
        console.log('reports: ', response.data.reports);
          const reports = response.data.reports.reverse().slice(0, 3);
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
            },
          });
          table.render(this.tableContainer);
      });
    });
  }
}
