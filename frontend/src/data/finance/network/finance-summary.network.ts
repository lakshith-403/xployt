import NETWORK, { Response } from '../../network/network';

export interface FinanceSummary {
  totalPaid: number;
  pendingPayments: number;
  totalAmount: number;
}

export class financeSummaryEndpoints {
  private static readonly BASE_URL = '/api/finance-summary';

  static async getUserFinanceSummary(userId: number, userRole: string): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}/${userId}/${userRole}`);
  }
}
