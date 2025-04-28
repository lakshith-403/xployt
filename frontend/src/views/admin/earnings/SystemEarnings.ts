import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import { CustomTable } from '@components/table/customTable';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import { CACHE_STORE } from '@data/cache';
import { SystemEarning } from '@data/finance/cache/system-earnings.cache';
import { Button } from '@/components/button/base';

class SystemEarningsView extends View {
  private earningsContainer?: HTMLElement;
  private dateFilterContainer?: HTMLElement;
  private summaryContainer?: HTMLElement;
  private tableContainer?: HTMLElement;
  private startDateInput?: HTMLInputElement;
  private endDateInput?: HTMLInputElement;
  private isDateFiltered: boolean = false;
  private filteredEarnings: SystemEarning[] = [];
  private currentEarnings: SystemEarning[] = [];

  constructor(params: any) {
    super(params);
  }

  render(q: Quark): void {
    this.currentQuark = q;
    this.setupView(q);
    this.loadEarningsData();
  }

  private setupView(q: Quark): void {
    $(q, 'div', 'system-earnings-container', {}, (q) => {
      $(q, 'h1', '', {}, 'System Earnings');

      // Date filter section
      this.dateFilterContainer = $(q, 'div', 'filter-container', {}, (q) => {
        $(q, 'div', 'date-filter', {}, (q) => {
          $(q, 'span', '', {}, 'Filter by date: ');

          $(q, 'div', 'date-inputs', {}, (q) => {
            $(q, 'label', '', {}, 'Start Date:');
            this.startDateInput = $(q, 'input', '', { type: 'date' }) as HTMLInputElement;

            $(q, 'label', '', {}, 'End Date:');
            this.endDateInput = $(q, 'input', '', { type: 'date' }) as HTMLInputElement;

            new Button({
              label: 'Apply Filter',
              onClick: () => this.applyDateFilter(),
            }).render(q);

            new Button({
              label: 'Clear Filter',
              onClick: () => this.clearDateFilter(),
            }).render(q);

            new Button({
              label: 'Download CSV',
              onClick: () => this.downloadCSV(),
            }).render(q);
          });
        });
      });

      // Summary section
      this.summaryContainer = $(q, 'div', 'summary-container', {});

      // Table container
      this.tableContainer = $(q, 'div', 'table-container', { id: 'earnings-table-container' });

      // Set initial date values (last 30 days)
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      if (this.startDateInput && this.endDateInput) {
        this.startDateInput.value = this.formatDate(thirtyDaysAgo);
        this.endDateInput.value = this.formatDate(today);
      }
    });
  }

  private async loadEarningsData(): Promise<void> {
    try {
      LoadingScreen.showLocal('earnings-table-container');

      const earningsData = await CACHE_STORE.getSystemEarnings().get(true);
      this.currentEarnings = earningsData.earnings;

      this.renderSummary(earningsData.totalEarnings);
      this.renderEarningsTable(earningsData.earnings);
    } catch (error) {
      console.error('Error loading system earnings:', error);
    } finally {
      LoadingScreen.hideLocal('earnings-table-container');
    }
  }

  private async applyDateFilter(): Promise<void> {
    if (!this.startDateInput || !this.endDateInput) return;

    const startDate = this.startDateInput.value;
    const endDate = this.endDateInput.value;

    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      LoadingScreen.showLocal('earnings-table-container');
      this.isDateFiltered = true;

      this.filteredEarnings = await CACHE_STORE.getSystemEarnings().getByDateRange(startDate, endDate);
      this.currentEarnings = this.filteredEarnings;

      // Calculate total from filtered earnings
      const totalEarnings = this.filteredEarnings.reduce((sum, earning) => sum + earning.amount, 0);

      this.renderSummary(totalEarnings);
      this.renderEarningsTable(this.filteredEarnings);
    } catch (error) {
      console.error('Error applying date filter:', error);
    } finally {
      LoadingScreen.hideLocal('earnings-table-container');
    }
  }

  private async clearDateFilter(): Promise<void> {
    this.isDateFiltered = false;

    // Reset date inputs to last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    if (this.startDateInput && this.endDateInput) {
      this.startDateInput.value = this.formatDate(thirtyDaysAgo);
      this.endDateInput.value = this.formatDate(today);
    }

    // Reload all earnings data
    this.loadEarningsData();
  }

  private downloadCSV(): void {
    if (!this.currentEarnings.length) {
      alert('No data available to download');
      return;
    }

    const headers = ['ID', 'Report ID', 'Client ID', 'Hacker ID', 'Amount', 'Description', 'Date'];

    const csvRows = [
      headers.join(','),
      ...this.currentEarnings.map((earning) => {
        return [
          earning.id,
          earning.reportId,
          earning.clientId,
          earning.hackerId,
          earning.amount.toFixed(2),
          `"${earning.description.replace(/"/g, '""')}"`, // Escape quotes in description
          this.formatDateTime(earning.timestamp),
        ].join(',');
      }),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a download link and trigger the download
    const link = document.createElement('a');
    const dateInfo = this.isDateFiltered ? `_${this.startDateInput?.value}_to_${this.endDateInput?.value}` : `_${this.formatDate(new Date())}`;

    link.setAttribute('href', url);
    link.setAttribute('download', `system_earnings${dateInfo}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private renderSummary(totalEarnings: number): void {
    if (!this.summaryContainer) return;

    this.summaryContainer.innerHTML = '';
    $(this.summaryContainer, 'div', 'total-summary', {}, (q) => {
      $(q, 'h3', '', {}, 'Total Earnings');
      $(q, 'p', 'total-amount', {}, `$${totalEarnings.toFixed(2)}`);

      const dateLabel = this.isDateFiltered ? `for period ${this.startDateInput?.value} to ${this.endDateInput?.value}` : '(all time)';

      $(q, 'p', 'date-range', {}, dateLabel);
    });
  }

  private renderEarningsTable(earnings: SystemEarning[]): void {
    if (!this.tableContainer) return;

    this.tableContainer.innerHTML = '';

    const tableHeaders = ['ID', 'Report', 'Client ID', 'Hacker ID', 'Amount', 'Description', 'Date'];

    // Format data for the table
    const tableData = earnings.map((earning) => {
      return {
        id: earning.id,
        reportId: earning.reportId,
        clientId: earning.clientId,
        hackerId: earning.hackerId,
        amount: `$${earning.amount.toFixed(2)}`,
        description: earning.description,
        timestamp: this.formatDateTime(earning.timestamp),
      };
    });

    // Configure the table options
    const tableOptions = {
      orderKeys: ['id', 'reportId', 'clientId', 'hackerId', 'amount', 'description', 'timestamp'],
      noDataMessage: 'No earnings data available',
    };

    // Create and render the table
    new CustomTable({
      content: tableData,
      headers: tableHeaders,
      className: 'earnings-table',
      options: tableOptions,
    }).render(this.tableContainer);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDateTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }
}

export const systemEarningsViewHandler = new ViewHandler('/earnings', SystemEarningsView);
