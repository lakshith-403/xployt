import { CacheObject } from '../../cacheBase';
import { financeEndpoints } from '../network/finance.network';

export interface Transaction {
  transactionId: number;
  userId: number;
  amount: number;
  description: string;
  timestamp: string;
  type: string;
}

export interface Balance {
  userId: number;
  balance: number;
}

export interface TransactionResponse {
  balance: Transaction[];
  userId: number;
}

export class FinanceCache extends CacheObject<{ balance: Balance; transactions: Transaction[] }> {
  private userId: number;

  constructor(userId: number) {
    super();
    this.userId = userId;
  }

  async load(): Promise<{ balance: Balance; transactions: Transaction[] }> {
    const balanceResponse = await financeEndpoints.getUserBalance(this.userId);
    const transactionsResponse = await financeEndpoints.getUserTransactions(this.userId);

    console.log('Balance response:', balanceResponse);
    console.log('Transactions response:', transactionsResponse);

    if (!balanceResponse.is_successful || !transactionsResponse.is_successful) {
      throw new Error('Failed to load finance data');
    }

    const transactions = (transactionsResponse.data as TransactionResponse)?.balance || [];
    // The balance is directly returned in the data field as a number
    const balance = balanceResponse.data as unknown as Balance;

    return {
      balance,
      transactions,
    };
  }
}
