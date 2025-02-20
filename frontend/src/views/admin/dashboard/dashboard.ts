import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';
import './dashboard.scss';
import PieChart from '@/components/charts/pieChart';
import NETWORK from '@/data/network/network';
export class AdminDashboard extends View {
  private pieChartContainer!: HTMLElement;

  constructor() {
    super();
  }

  private async loadPieChartData(): Promise<any> {
    try {
      const response = await NETWORK.get('/api/dashboard/project-stats/admin/0', { showLoading: true, handleError: true, throwError: true });
      console.log(response);
      const formattedStats = response.data.projectStats.reduce((acc: any, stat: any) => {
        acc[stat.state] = stat.count;
        return acc;
      }, {});
      console.log(formattedStats);
      return formattedStats;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    $(q, 'div', 'admin-dashboard py-2 d-flex flex-column align-items-center', {}, (q) => {
      $(q, 'h1', 'admin-dashboard-title text-center heading-1', {}, 'Admin Dashboard');
      this.pieChartContainer = $(q, 'div', 'pie-chart-container', {}, (q) => {
        $(q, 'p', 'pie-chart-subtitle text-center sub-heading-3', {}, 'Project Statistics');
      });
    });

    try {
      const pieChartData = await this.loadPieChartData();
      const pieChartOptions = {
        data: {
          ...pieChartData,
        },
        width: 300,
        height: 300,
        colorScheme: 'greenTheme' as 'greenTheme',
        className: 'w-30 d-flex justify-content-center align-items-center text-primary',
        foregroundColor: 'black',
      };
      const pieChart = new PieChart(pieChartOptions);
      pieChart.render(this.pieChartContainer);
    } catch (error) {
      console.error(error);
    }
  }
}

export const adminDashboardViewHandler = new ViewHandler('', AdminDashboard);
