import { Quark, QuarkFunction as $ } from '../../ui_lib/quark';
import './pieChart.scss';

interface PieChartOptions {
  data: { [key: string]: number };
  title?: string;
  className?: string;
  subtitle?: string;
  colorScheme?: 'scheme1' | 'scheme2' | 'scheme3' | 'greyTheme' | 'greenTheme' | 'blackTheme';
  width?: number;
  height?: number;
  border?: boolean;
  foregroundColor?: string;
}
class PieChart {
  private options: PieChartOptions;
  private colorSchemes = {
    scheme1: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#9966FF'],
    scheme2: ['#4BC0C0', '#FF9F40', '#9966FF', '#FF6384', '#36A2EB'],
    scheme3: ['#FFCD56', '#C9CBCF', '#FF6384', '#4BC0C0', '#FF9F40'],
    greyTheme: ['#B0B0B0', '#D3D3D3', '#A9A9A9', '#808080', '#696969'],
    greenTheme: ['#008000', '#00FF00', '#32CD32', '#98FB98', '#2E8B57'],
    blackTheme: ['#000000', '#2F2F2F', '#4F4F4F', '#6F6F6F', '#8F8F8F'],
  };

  constructor(options: PieChartOptions) {
    this.options = {
      width: options.width ?? 400,
      height: options.height ?? 400,
      colorScheme: options.colorScheme ?? 'greyTheme',
      border: options.border ?? false,
      foregroundColor: options.foregroundColor ?? '#000000',
      title: options.title,
      className: options.className,
      subtitle: options.subtitle,
      data: options.data,
    };
  }

  public render(q: Quark): void {
    const canvas = $(
      q,
      'canvas',
      'myPieChart ' + this.options.className,
      { width: this.options.width!, height: this.options.height!, class: this.options.border ? 'border' : '' },
      () => {}
    ) as HTMLCanvasElement;

    const ctx = canvas.getContext('2d')!;
    const dataValues = Object.values(this.options.data);
    const labels = Object.keys(this.options.data);
    const totalValue = dataValues.reduce((acc, value) => acc + value, 0);
    const colors = this.colorSchemes[this.options.colorScheme!];

    let startAngle = 0;

    dataValues.forEach((value, index) => {
      const sliceAngle = (value / totalValue) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width / 2, canvas.height / 2), startAngle, startAngle + sliceAngle);
      ctx.closePath();

      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();

      startAngle += sliceAngle;
    });

    startAngle = 0;
    dataValues.forEach((value, index) => {
      const sliceAngle = (value / totalValue) * 2 * Math.PI;
      const labelX = canvas.width / 2 + (Math.min(canvas.width / 2, canvas.height / 2) / 2) * Math.cos(startAngle + sliceAngle / 2);
      const labelY = canvas.height / 2 + (Math.min(canvas.width / 2, canvas.height / 2) / 2) * Math.sin(startAngle + sliceAngle / 2);

      ctx.fillStyle = this.options.foregroundColor ?? '#fff';
      ctx.font = '14px Arial';
      ctx.fillText(labels[index], labelX, labelY);

      startAngle += sliceAngle;
    });

    if (this.options.title) {
      ctx.fillStyle = this.options.foregroundColor ?? '#fff';
      ctx.font = '16px Arial';
      ctx.fillText(this.options.title, canvas.width / 2, 20);
    }

    if (this.options.subtitle) {
      ctx.fillStyle = this.options.foregroundColor ?? '#fff';
      ctx.font = '12px Arial';
      ctx.fillText(this.options.subtitle, canvas.width / 2, 40);
    }
  }
}

export default PieChart;
