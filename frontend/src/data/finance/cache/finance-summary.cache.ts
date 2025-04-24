import { CacheObject } from '../../cacheBase';
import { FinanceSummary, financeSummaryEndpoints } from '../network/finance-summary.network';

export class FinanceSummaryCache extends CacheObject<FinanceSummary> {
  private userId: number;
  private userRole: string;

  constructor(userId: number, userRole: string) {
    super();
    this.userId = userId;
    this.userRole = userRole;
  }

  async load(): Promise<FinanceSummary> {
    const response = await financeSummaryEndpoints.getUserFinanceSummary(this.userId, this.userRole);

    if (!response.is_successful) {
      throw new Error('Failed to load finance summary data');
    }

    return response.data as FinanceSummary;
  }
}
