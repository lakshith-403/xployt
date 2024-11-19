import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from './../../../ui_lib/quark';
import { View } from '../../../ui_lib/view';
import PieChart from '../../../components/charts/pieChart';
import './dashboard.scss';

const headers = ['ID', 'Name', 'Status'];
const checkboxState = { '1': true, '2': false, '3': true };
const filteredField = 'status';

class Dashboard extends View {
  constructor() {
    super();
  }

  public render(q: Quark): void {
    $(q, 'div', 'dashboard', {}, (q) => {
      $(q, 'h1', '', {}, 'Dashboard');
      this.renderPieChart(q);
    });
  }

  private renderPieChart(q: Quark): void {
    // Create a container for the pie chart
    const chartContainer = $(q, 'div', 'chart-container', {}, () => {});

    // Define the pie chart options
    const pieChartOptions = {
      data: {
        Completed: 10,
        'In Progress': 20,
        Pending: 30,
        'Not Started': 40,
        'On Hold': 50,
      },
      title: 'Project Distribution',
      subtitle: 'Current Status of Projects',
      colorScheme: 'greenTheme' as 'greenTheme',
    };

    // Instantiate and render the PieChart
    const pieChart = new PieChart(pieChartOptions);
    pieChart.render(chartContainer);
  }
}

export const validatorDashboardViewHandler = new ViewHandler('dashboard', Dashboard);
