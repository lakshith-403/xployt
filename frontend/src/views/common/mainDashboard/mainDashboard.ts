import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
import PieChart from '@/components/charts/pieChart';
import { CustomTable } from '@/components/table/customTable';
import * as utils from '@/ui_lib/utils';
import { CACHE_STORE } from '@/data/cache';
import { router } from '@/ui_lib/router';
import { UserType } from '@/data/user';
import { PopupTable, ContentItem } from '@components/table/popup.lite.table';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { BREADCRUMBS } from '@/components/breadCrumbs/breadCrumbs';
import { Button } from '@/components/button/base';

export class MainDashboard extends View {
  private pieChartContainer!: HTMLElement;
  private recentProjectsContainer!: HTMLElement;
  private userId!: string;
  private userType!: UserType;
  params: any;

  constructor(params: { userId: string }) {
    super();
    this.params = params;
  }

  private async loadUser(): Promise<void> {
    const currentUser = await CACHE_STORE.getUser().get();
    this.userId = currentUser.id;
    this.userType = currentUser.type as UserType;
  }

  private async loadProjectStats(): Promise<any> {
    try {
      const endpoint = this.getStatsEndpoint();
      const response = await NETWORK.get(endpoint, { showLoading: true, handleError: true, throwError: true });
      const formattedStats = response.data.stats.reduce((acc: any, stat: any) => {
        acc[stat.state] = stat.count;
        return acc;
      }, {});
      return formattedStats;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async loadRecentProjects(): Promise<any> {
    try {
      const endpoint = this.getRecentProjectsEndpoint();
      const response = await NETWORK.get(endpoint, { showLoading: true, handleError: true, throwError: true });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private getStatsEndpoint(): string {
    switch (this.userType) {
      case 'Validator':
        return `/api/dashboard/project-stats/validator/${this.userId}`;
      case 'ProjectLead':
        return `/api/dashboard/project-stats/projectLead/${this.userId}`;
      case 'Admin':
        return '/api/dashboard/project-stats/admin/0';
      default:
        throw new Error(`Unsupported user type: ${this.userType}`);
    }
  }

  private getRecentProjectsEndpoint(): string {
    switch (this.userType) {
      case 'Validator':
        return `/api/dashboard/recent-projects/validator/${this.userId}`;
      case 'ProjectLead':
        return `/api/dashboard/recent-projects/projectLead/${this.userId}`;
      case 'Admin':
        return '/api/dashboard/recent-projects/admin/0';
      default:
        throw new Error(`Unsupported user type: ${this.userType}`);
    }
  }

  private getDashboardTitle(): string {
    switch (this.userType) {
      case 'Validator':
        return 'Validator Dashboard';
      case 'ProjectLead':
        return 'Project Lead Dashboard';
      case 'Admin':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  }

  private getTableCallback(): ((project: any) => void) | undefined {
    switch (this.userType) {
      default:
        return undefined;
    }
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    await this.loadUser();

    $(q, 'div', 'py-2 d-flex flex-column align-items-center', {}, (q) => {
      $(q, 'h1', 'text-center heading-1', {}, this.getDashboardTitle());
      $(q, 'div', 'container justify-content-between flex-container-lg gap-2', {}, (q) => {
        this.pieChartContainer = $(q, 'div', 'pie-chart-container align-items-center d-flex flex-column justify-content-center', {}, (q) => {
          $(q, 'p', 'pie-chart-subtitle text-center sub-heading-3', {}, 'Project Statistics');
        });
        this.recentProjectsContainer = $(q, 'div', 'recent-projects-container', {}, (q) => {
          $(q, 'p', 'recent-projects-title text-center sub-heading-3', {}, 'Recent Projects');
        });
      });
    });

    try {
      const pieChartData = await this.loadProjectStats();
      const pieChartOptions = {
        data: {
          ...pieChartData,
        },
        width: 500,
        height: 500,
        colorScheme: 'greenTheme' as 'greenTheme',
        className: 'w-30 d-flex justify-content-center align-items-center text-primary',
        foregroundColor: 'black',
      };
      const pieChart = new PieChart(pieChartOptions);
      pieChart.render(this.pieChartContainer);
    } catch (error) {
      console.error(error);
    }

    try {
      const recentProjects = await this.loadRecentProjects();
      const TABLE_HEADERS = ['projectId', 'state', 'title', 'createdAt'];
      const table = new CustomTable({
        content: utils.filterObjectsByFields(recentProjects.stats, ['projectId', 'state', 'title', 'createdAt']),
        headers: TABLE_HEADERS,
        className: 'table-users py-1 mb-4',
        options: {
          noDataMessage: 'No projects to show',
          callback: this.getTableCallback(),
        },
      });
      table.render(this.recentProjectsContainer);
    } catch (error) {
      console.error(error);
    }
  }
}

export const mainDashboardViewHandler = new ViewHandler('/dashboard', MainDashboard);
