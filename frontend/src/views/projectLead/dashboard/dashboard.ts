import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import NETWORK from '@/data/network/network';
import { PopupTable, ContentItem } from '@components/table/popup.lite.table';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { Button } from '@/components/button/base';
import PieChart from '@/components/charts/pieChart';
import { CustomTable } from '@/components/table/customTable';
import * as utils from '@/ui_lib/utils';
import { CACHE_STORE } from '@/data/cache';
import { BREADCRUMBS } from '@/components/breadCrumbs/breadCrumbs';
import { router } from '@/ui_lib/router';
export class ProjectLeadDashboard extends View {
  private applicationsTableContent: ContentItem[] = [];
  private applicationsTableContainer!: HTMLElement;
  private userId!: string;
  params: any;
  applications: any;
  private pieChartContainer!: HTMLElement;
  private recentProjectsContainer!: HTMLElement;

  constructor(params: any) {
    super();
    this.params = params;
  }

  private async loadUser(): Promise<any> {
    const currentUser = await CACHE_STORE.getUser().get();
    // console.log(currentUser);
    this.userId = currentUser.id;
  }

  private async loadProjectStats(): Promise<any> {
    try {
      const response = await NETWORK.get(`/api/dashboard/project-stats/projectLead/${this.userId}`, { showLoading: true, handleError: true, throwError: true });
      // console.log(response);
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
      const response = await NETWORK.get(`/api/dashboard/recent-projects/projectLead/${this.userId}`, { showLoading: true, handleError: true, throwError: true });
      // console.log(response);
      return response.data; // Assuming you want to return the recent projects data
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    $(q, 'div', 'py-2 d-flex flex-column align-items-center', {}, (q) => {
      $(q, 'h1', 'text-center heading-1', {}, 'Project Lead Dashboard');
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
      await this.loadUser();
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
      console.log(utils.filterObjectsByFields(recentProjects.stats, ['projectId', 'state', 'title', 'createdAt']));
      const table = new CustomTable({
        content: utils.filterObjectsByFields(recentProjects.stats, ['projectId', 'state', 'title', 'createdAt']),
        headers: TABLE_HEADERS,
        className: 'table-users py-1 mb-4',
        options: {
          noDataMessage: 'No projects to show',
          callback: (project) => {
            BREADCRUMBS.addBreadcrumb({ label: 'Projects', link: '/projects' });
            BREADCRUMBS.addBreadcrumb({ label: project.projectId.toString(), link: `/projects/${project.projectId}` });
            router.navigateTo(`/projects/${project.projectId}`);
          },
        },
      });
      table.render(this.recentProjectsContainer);
    } catch (error) {
      console.error(error);
    }
  }
}

// export const projectLeadDashboardViewHandler = new ViewHandler('/project-lead-dashboard', ProjectLeadDashboard);
