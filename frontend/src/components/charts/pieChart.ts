import {Quark, QuarkFunction as $} from '../../ui_lib/quark';
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
    legendPosition?: 'bottom' | 'right' | 'none';
}

class PieChart {
    private options: PieChartOptions;
    private colorSchemes = {
        scheme1: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#9966FF'],
        scheme2: ['#4BC0C0', '#FF9F40', '#9966FF', '#FF6384', '#36A2EB'],
        scheme3: ['#FFCD56', '#C9CBCF', '#FF6384', '#4BC0C0', '#FF9F40'],
        greyTheme: ['#B0B0B0', '#D3D3D3', '#A9A9A9', '#808080', '#696969'],
        greenTheme: ['#86ebd9', '#4cbfb0', '#006c59', '#1d4e53', '#30404d'],
        blackTheme: ['#000000', '#2F2F2F', '#4F4F4F', '#6F6F6F', '#8F8F8F'],

    };

    constructor(options: PieChartOptions) {
        this.options = {
            width: options.width ?? 400,
            height: options.height ?? 400,
            colorScheme: options.colorScheme ?? 'greenTheme',
            border: options.border ?? false,
            foregroundColor: options.foregroundColor ?? '#333333',
            title: options.title,
            className: options.className,
            subtitle: options.subtitle,
            data: options.data,
            legendPosition: options.legendPosition ?? 'bottom',
        };
    }

    public render(q: Quark): void {
        // Create wrapper div for better layout control
        const chartWrapper = $(q, 'div', 'pie-chart-wrapper ' + (this.options.className || ''), {}, (wrapper) => {

            // Canvas for the chart
            const canvasContainer = $(wrapper, 'div', 'canvas-container', {});

            const canvas = $(
                canvasContainer,
                'canvas',
                'pie-chart-canvas',
                {
                    width: this.options.width!,
                    height: this.options.height!,
                    class: this.options.border ? 'border' : ''
                },
                () => {
                }
            ) as HTMLCanvasElement;

            // Create legend if not disabled
            if (this.options.legendPosition !== 'none') {
                this.renderLegend(wrapper);
            }
        });

        // Get the canvas from the wrapper
        const canvas = chartWrapper.querySelector('canvas') as HTMLCanvasElement;

        const ctx = canvas.getContext('2d')!;
        const dataValues = Object.values(this.options.data);
        const labels = Object.keys(this.options.data);
        const totalValue = dataValues.reduce((acc, value) => acc + value, 0);
        const colors = this.colorSchemes[this.options.colorScheme!];

        // Clear canvas before drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw chart background
        ctx.fillStyle = '#1A1A1AFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let startAngle = 0;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8; // 80% of the available space for better proportions

        if (dataValues.length === 0) {
            this.renderEmptyState(ctx, canvas);
            return;
        }

        // Draw pie slices with subtle shadow
        // ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        // ctx.shadowBlur = 5;
        // ctx.shadowOffsetX = 2;
        // ctx.shadowOffsetY = 2;

        dataValues.forEach((value, index) => {
            const sliceAngle = (value / totalValue) * 2 * Math.PI;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();

            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();

            // Add slice border for better definition
            // ctx.strokeStyle = '#ffffff';
            // // ctx.lineWidth = 1;
            // ctx.stroke();

            startAngle += sliceAngle;
        });

        // Reset shadow for text
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw data percentages on the chart
        startAngle = 0;
        dataValues.forEach((value, index) => {
            const sliceAngle = (value / totalValue) * 2 * Math.PI;
            const percentage = Math.round((value / totalValue) * 100);

            // Calculate position for percentage text - midpoint of the slice, slightly outward
            const midAngle = startAngle + sliceAngle / 2;
            const labelDistance = radius * 0.7; // Position at 70% of the radius
            const labelX = centerX + labelDistance * Math.cos(midAngle);
            const labelY = centerY + labelDistance * Math.sin(midAngle);

            // Draw percentage text with a small background for better readability
            if (percentage >= 5) {

                const sliceColor = colors[index % colors.length];

                const r = parseInt(sliceColor.slice(1, 3), 16) / 255;
                const g = parseInt(sliceColor.slice(3, 5), 16) / 255;
                const b = parseInt(sliceColor.slice(5, 7), 16) / 255;

                const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';

                // Set text properties and draw
                ctx.fillStyle = textColor;
                ctx.font = 'bold 12px Montserrat';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${percentage}%`, labelX, labelY);
            }

            // if (percentage >= 5) { // Only show percentages for slices that are at least 5%
            //     // Background for text
            //     ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            //     const textWidth = ctx.measureText(`${percentage}%`).width;
            //     ctx.fillRect(labelX - textWidth / 2 - 3, labelY - 10, textWidth + 6, 20);
            //
            //     // Percentage text
            //     ctx.fillStyle = '#000000';
            //     ctx.font = 'bold 12px Montserrat';
            //     ctx.textAlign = 'center';
            //     ctx.textBaseline = 'middle';
            //     ctx.fillText(`${percentage}%`, labelX, labelY);
            // }

            startAngle += sliceAngle;
        });
    }

    private renderEmptyState(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        // Clear any previous content
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw empty state circle
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 4, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
        ctx.strokeStyle = '#d0d0d0';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw "No data" text
        ctx.fillStyle = '#888888';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
    }

    private renderLegend(wrapper: Quark): void {
        const legendClass = this.options.legendPosition === 'right' ? 'chart-legend legend-right' : 'chart-legend legend-bottom';

        $(wrapper, 'div', legendClass, {}, (legend) => {
            const labels = Object.keys(this.options.data);
            const colors = this.colorSchemes[this.options.colorScheme!];
            const values = Object.values(this.options.data);
            // const total = values.reduce((sum, val) => sum + val, 0);

            labels.forEach((label, index) => {
                $(legend, 'div', 'legend-item', {}, (item) => {
                    $(item, 'span', 'color-indicator', {
                        style: `background-color: ${colors[index % colors.length]};`
                    });

                    const value = values[index];
                    // const percentage = Math.round((value / total) * 100);

                    $(item, 'span', 'legend-label', {}, `${label} (${value})`);
                });
            });
        });
    }
}

export default PieChart;
