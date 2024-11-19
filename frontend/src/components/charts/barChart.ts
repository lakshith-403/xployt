import { Quark, QuarkFunction as $ } from '../../ui_lib/quark';
import './barChart.scss';

interface BarChartOptionsNew {
  width?: number;
  height?: number;
}

class BarChart {
  private options: BarChartOptionsNew;

  constructor(options: BarChartOptionsNew = {}) {
    this.options = options;
  }

  render(q: Quark) {
    $(q, 'div', 'bar-chart', {}, (q) => {
      q.innerHTML = 'BarChart';
    });
  }
}
