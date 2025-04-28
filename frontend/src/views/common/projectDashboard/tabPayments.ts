import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { User, UserCache } from '@data/user';
import { UserType } from '@data/user';
import { CACHE_STORE } from '@data/cache';
import { OverviewPayments } from './tabOverviewContent/commonComponents/payments';
import PieChart from '@/components/charts/pieChart';
import { CustomTable } from '@/components/table/customTable';
import { Button, ButtonType } from '@/components/button/base';
import modalManager from '@/components/ModalManager/ModalManager';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import './tabPayments.scss';
import { projectFinanceEndpoints } from '@/data/finance/network/project-finance.network';
import { ReportPayment } from '@/data/finance/cache/project-finance.cache';

export default class Payments {
  private userCache: UserCache;
  private role!: UserType;
  private projectReports: ReportPayment[] = [];
  private totalPaid: number = 0;
  private totalPending: number = 0;
  private tableContainer: HTMLElement | null = null;
  private statsContainer: HTMLElement | null = null;
  private loadingScreen: LoadingScreen | null = null;

  constructor(private projectId: string, private user: any, private projectInfo: any) {
    this.userCache = CACHE_STORE.getUser();
    this.user = user;
    this.role = user.type;
    this.projectInfo = projectInfo.project;
    console.log('projectInfo', this.projectInfo);

    modalManager.includeModal('payment-error', {
      '.modal-button.button-confirm': () => {
        modalManager.hide('payment-error');
      },
    });

    modalManager.includeModal('payment-success', {
      '.modal-button.button-confirm': () => {
        modalManager.hide('payment-success');
      },
    });
  }

  private async loadData(): Promise<void> {
    try {
      if (this.loadingScreen) {
        this.loadingScreen.show();
      }

      // Get project finance data from cache
      const financeData = await CACHE_STORE.getProjectFinance(Number(this.projectId)).get();
      console.log('Project finance data:', financeData);

      if (financeData && financeData.reports) {
        this.projectReports = financeData.reports;
        this.calculatePaymentStats();
        this.renderReportsTable();
        this.renderPaymentStats(financeData.totalExpenditure || 0);
      } else {
        console.error('Failed to load project finance data');
        this.showError('Failed to load project finance data');
      }
    } catch (error) {
      console.error('Failed to load project data:', error);
      this.showError('An error occurred while loading project data');
    } finally {
      if (this.loadingScreen) {
        this.loadingScreen.hide();
      }
    }
  }

  private calculatePaymentStats(): void {
    this.totalPaid = 0;
    this.totalPending = 0;

    this.projectReports.forEach((report) => {
      if (report.paid) {
        this.totalPaid += report.payment_amount;
      } else if (report.status === 'Validated') {
        this.totalPending += report.payment_amount;
      }
    });
  }

  private async processPayment(reportId: number): Promise<void> {
    try {
      LoadingScreen.show();

      const response = await projectFinanceEndpoints.makePayment(Number(this.projectId), reportId, Number(this.user.id));
      console.log('Payment response:', response);

      if (response.is_successful) {
        // Invalidate cache to fetch fresh data
        CACHE_STORE.getProjectFinance(Number(this.projectId)).invalidate_cache();

        this.showSuccess('Payment processed successfully');
        await this.loadData();
      } else {
        this.showError(response.error || 'Payment processing failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      this.showError('An error occurred while processing the payment');
    } finally {
      LoadingScreen.hide();
    }
  }

  private showError(message: string): void {
    const errorContent = `
      <div class="modal-body">
        <h3 class="modal-title">Error</h3>
        <p class="modal-message">${message}</p>
        <div class="modal-buttons">
          <button class="modal-button button-confirm">Close</button>
        </div>
      </div>
    `;
    modalManager.show('payment-error', errorContent);
  }

  private showSuccess(message: string): void {
    const successContent = `
      <div class="modal-body">
        <h3 class="modal-title">Success</h3>
        <p class="modal-message">${message}</p>
        <div class="modal-buttons">
          <button class="modal-button button-confirm">Close</button>
        </div>
      </div>
    `;
    modalManager.show('payment-success', successContent);
  }

  private renderReportsTable(): void {
    if (!this.tableContainer) return;

    this.tableContainer.innerHTML = '';

    const tableData = this.projectReports.map((report) => {
      const paymentButton =
        report.status === 'Validated' && !report.paid && this.role === 'Client'
          ? {
              render: (q: Quark) => {
                new Button({
                  label: 'Pay Now',
                  type: ButtonType.PRIMARY,
                  onClick: () => this.processPayment(report.reportId),
                }).render(q);
              },
            }
          : '';
      if (this.role === 'Client') {
        return {
          id: report.reportId,
          severity: report.severity,
          status: report.status,
          amount: `$${report.payment_amount.toFixed(2)}`,
          paid: report.paid ? 'Yes' : 'No',
          action: paymentButton,
        };
      } else {
        return {
          id: report.reportId,
          severity: report.severity,
          status: report.status,
          amount: `$${report.payment_amount.toFixed(2)}`,
          paid: report.paid ? 'Yes' : 'No',
        };
      }
    });

    const headers = ['ID', 'Severity', 'Status', 'Amount', 'Paid'];

    // Add action column only for clients
    if (this.role === 'Client') {
      headers.push('Action');
    }

    new CustomTable({
      content: tableData,
      headers: headers,
      className: 'reports-payment-table w-100',
      options: {
        clickable: false,
        noDataMessage: 'No reports available',
        cellClassName: 'd-flex justify-content-center align-items-center',
        cellClassNames: {
          1: 'd-flex justify-content-start align-items-center',
        },
      },
    }).render(this.tableContainer);
  }

  private renderPaymentStats(totalExpenditure: number = 0): void {
    if (!this.statsContainer) return;

    this.statsContainer.innerHTML = '';

    $(this.statsContainer, 'div', 'payment-stats d-flex flex-row justify-content-around mb-4', {}, (q) => {
      $(q, 'div', 'stat-card', {}, (q) => {
        $(q, 'div', 'stat-title', {}, 'Total Paid');
        $(q, 'div', 'stat-value', {}, `$${this.totalPaid.toFixed(2)}`);
      });

      $(q, 'div', 'stat-card', {}, (q) => {
        $(q, 'div', 'stat-title', {}, 'Pending Payments');
        $(q, 'div', 'stat-value', {}, `$${this.totalPending.toFixed(2)}`);
      });

      if (this.role !== 'Hacker') {
        $(q, 'div', 'stat-card', {}, (q) => {
          $(q, 'div', 'stat-title', {}, 'Total Allocated');
          $(q, 'div', 'stat-value', {}, `$${totalExpenditure.toFixed(2)}`);
        });
      }
    });

    if (totalExpenditure > 0 || this.totalPaid > 0 || this.totalPending > 0) {
      const pieChartOptions = {
        data: {
          Paid: this.totalPaid,
          Pending: this.totalPending,
          Allocated: totalExpenditure,
        },
        title: '',
        subtitle: '',
        colorScheme: 'greenTheme' as 'greenTheme',
      };

      if (this.role !== 'Hacker') {
        $(this.statsContainer, 'div', '', {}, (q) => {
          $(q, 'h3', 'mb-3', {}, 'Payment Distribution');
          const pieChart = new PieChart(pieChartOptions);
          pieChart.render(q);
        });
      }
    }
  }

  async render(q: Quark): Promise<void> {
    this.loadingScreen = new LoadingScreen(q);
    this.loadingScreen.show();

    $(q, 'div', 'payments-view py-2 d-flex flex-column', {}, (q) => {
      $(q, 'h2', 'mb-4', {}, 'Project Payments');

      this.statsContainer = $(q, 'div', 'payment-statistics mb-4', {});

      $(q, 'div', 'reports-section', {}, (q) => {
        $(q, 'h3', 'mb-3', {}, 'Reports Payment Status');
        this.tableContainer = $(q, 'div', 'reports-table-container', {});
      });
    });

    await this.loadData();
    this.loadingScreen.hide();
  }
}
