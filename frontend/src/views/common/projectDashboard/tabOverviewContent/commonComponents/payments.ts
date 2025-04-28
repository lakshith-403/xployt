import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { PriceCard } from '@components/card/card.base';
import { CustomTable } from '@/components/table/customTable';
import NETWORK from '@/data/network/network';
import { UserType } from '@data/user';
import '../../tabOverview.scss';

interface PaymentLevel {
  level: string;
  amount: number;
  reportCount: number;
  items: string;
}

export class OverviewPayments {
  private paymentData: PaymentLevel[] = [];
  private totalPricePool: number = 0;
  private totalExpenditure: number = 0;

  constructor(private readonly projectId: string, private readonly userRole: UserType, private readonly userId?: string) {}

  private async loadPaymentData(): Promise<void> {
    try {
      // Load payment levels for all roles
      const paymentResponse = await NETWORK.get(`/api/common/paymentInfo/${this.projectId}?role=${this.userRole}${this.userId ? `&userId=${this.userId}` : ''}`);
      this.paymentData = paymentResponse.data.payments;

      // Load funding info only for Client and ProjectLead
      if (['Client', 'ProjectLead', 'Admin', 'Hacker'].includes(this.userRole)) {
        const fundingResponse = await NETWORK.get(`/api/common/projectFunding/${this.projectId}`);
        this.totalPricePool = fundingResponse.data.initialFunding;
        this.totalExpenditure = fundingResponse.data.totalExpenditure;
      }
    } catch (error) {
      console.error('Failed to load payment data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    await this.loadPaymentData();

    $(q, 'div', 'section-content', {}, (q) => {
      // Only show price cards for Client and ProjectLead
      if (['Client', 'ProjectLead', 'Admin'].includes(this.userRole)) {
        $(q, 'div', 'summary', {}, (q) => {
          new PriceCard({
            title: 'Total Price Pool',
            amount: this.totalPricePool,
          }).render(q);

          new PriceCard({
            title: 'Total Expenditure',
            amount: this.totalExpenditure,
          }).render(q);
        });
      }

      if (this.paymentData.length > 0) {
        $(q, 'div', '', {}, (q) => {
          const tableData = this.paymentData.map((payment) => ({
            severity: payment.level,
            amount: payment.amount,
            reports: payment.reportCount,
            bugType: payment.items.split(',').join('\n\n'),
          }));
          new CustomTable({
            content: tableData,
            headers: ['Severity', 'Amount', 'Reports', 'Bug Type'],
            className: 'table-payments w-100',
            options: {
              filteredField: 'severity',
              falseKeys: [],
              clickable: false,
              noDataMessage: 'No payment levels configured',
              cellClassName: 'd-flex justify-content-center align-items-center',
              cellClassNames: {
                3: 'd-flex w-min-8 justify-content-center align-items-center text-small',
              },
            },
          }).render(q);
        });
      } else {
        $(q, 'div', 'text-center p-3', {}, (q) => {
          $(q, 'span', '', {}, 'No payment levels configured');
        });
      }
    });
  }
}
