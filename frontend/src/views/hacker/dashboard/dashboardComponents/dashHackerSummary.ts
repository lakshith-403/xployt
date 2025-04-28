import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { PriceCard } from '@components/card/card.base';
import { CACHE_STORE } from '@data/cache';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { FinanceSummary } from '@/data/finance/network/finance-summary.network';

export class dashHackerSummary {
  private userId: number = 0;
  private totalEarnings: number = 0;
  private pendingEarnings: number = 0;
  private container: HTMLElement | null = null;
  private summaryCards: {
    totalEarnings: PriceCard;
    pendingEarnings: PriceCard;
  };

  constructor(userId?: number) {
    // Initialize price cards with default values
    this.summaryCards = {
      totalEarnings: new PriceCard({
        title: 'Total Earnings',
        amount: 0,
      }),
      pendingEarnings: new PriceCard({
        title: 'Pending Earnings',
        amount: 0,
      }),
    };

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
      LoadingScreen.showLocal('hacker-dashboard-summary');

      // Get financial summary from cache
      const summaryData = await CACHE_STORE.getFinanceSummary(this.userId, 'Hacker').get();

      if (summaryData) {
        // Update local values
        this.totalEarnings = summaryData.totalPaid || 0;
        this.pendingEarnings = summaryData.pendingPayments || 0;

        // Update cards
        this.summaryCards.totalEarnings.update(this.totalEarnings);
        this.summaryCards.pendingEarnings.update(this.pendingEarnings);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      // Hide loading indicator
      LoadingScreen.hideLocal('hacker-dashboard-summary');
    }
  }

  render(q: Quark): void {
    q.innerHTML = '';
    $(q, 'div', '', { id: 'hacker-dashboard-summary' }, (q) => {
      $(q, 'div', 'summary', {}, (q) => {
        this.container = q;

        // Render price cards with initial values
        this.summaryCards.totalEarnings.render(q);
        this.summaryCards.pendingEarnings.render(q);

        // Load real data if we have userId
        if (this.userId) {
          this.loadFinancialData();
        }
      });
    });
  }
}
