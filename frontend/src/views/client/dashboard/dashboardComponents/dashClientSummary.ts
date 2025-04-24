import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { Card, PriceCard } from '@components/card/card.base';
import { Button } from '@components/button/base';
import { router } from '@ui_lib/router';
import { IconButton } from '@components/button/icon.button';
import { CACHE_STORE } from '@data/cache';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { FinanceSummary } from '@/data/finance/network/finance-summary.network';

export class dashClientSummary {
  private container: Quark | null = null;
  private totalExp: PriceCard;
  private pendingExp: PriceCard;
  private requestProjectBtn: IconButton;
  private userId: number = 0;
  private totalExpenses: number = 0;
  private pendingPayments: number = 0;

  constructor(userId?: number) {
    // Initialize with default values, will be updated later
    this.totalExp = new PriceCard({
      title: 'Total Expenses',
      amount: 0,
    });

    this.pendingExp = new PriceCard({
      title: 'Pending Payments',
      amount: 0,
    });

    this.requestProjectBtn = new IconButton({
      icon: 'fa-solid fa-plus fa-xl',
      label: '',
      onClick: () => {
        router.navigateTo('/client/project-request');
      },
    });

    if (userId) {
      this.userId = userId;
    } else {
      // Try to get current user ID if not provided
      const userCache = CACHE_STORE.getUser();
      userCache
        .get()
        .then((user) => {
          this.userId = Number(user.id);
          this.loadFinancialData();
        })
        .catch((error) => {
          console.error('Error getting user data:', error);
        });
    }
  }

  private async loadFinancialData(): Promise<void> {
    if (!this.userId || !this.container) return;

    try {
      // Show loading indicator
      LoadingScreen.showLocal('client-dashboard-summary');

      // Get financial summary from cache
      const summaryData = await CACHE_STORE.getFinanceSummary(this.userId, 'Client').get();

      if (summaryData) {
        // Update local values
        this.totalExpenses = summaryData.totalPaid || 0;
        this.pendingPayments = summaryData.pendingPayments || 0;

        // Update the price cards
        this.totalExp.update(this.totalExpenses);
        this.pendingExp.update(this.pendingPayments);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      // Hide loading indicator
      LoadingScreen.hideLocal('client-dashboard-summary');
    }
  }

  render(q: Quark): void {
    q.innerHTML = '';
    $(q, 'div', 'client-dashboard', { id: 'client-dashboard-summary' }, (q) => {
      $(q, 'div', 'summary', {}, (q) => {
        this.container = q;

        // Render the price cards with initial values
        this.totalExp.render(q);
        this.pendingExp.render(q);

        new Card({
          title: 'Request a Project',
          content: $(q, 'div', 'req-btn', {}, (q) => {
            this.requestProjectBtn.render(q);
          }),
        }).render(q);

        // Load real data if we have userId
        if (this.userId) {
          this.loadFinancialData();
        }
      });
    });
  }
}
