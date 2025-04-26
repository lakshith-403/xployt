import NETWORK from '@/data/network/network';

export interface SystemEarning {
  id: number;
  reportId: number;
  clientId: number;
  hackerId: number;
  amount: number;
  description: string;
  timestamp: string;
}

export interface SystemEarningsData {
  earnings: SystemEarning[];
  totalEarnings: number;
}

export class SystemEarningsCache {
  private data: SystemEarningsData | null = null;
  private loading: boolean = false;

  constructor() {}

  public async get(forceRefresh: boolean = false): Promise<SystemEarningsData> {
    if (!this.data || forceRefresh) {
      try {
        this.loading = true;
        const response = await NETWORK.get('/api/system/earnings/', {
          throwError: true,
        });

        if (response && response.is_successful && response.data) {
          this.data = response.data as SystemEarningsData;
        } else {
          throw new Error('Failed to fetch system earnings data');
        }
      } catch (error) {
        console.error('Error fetching system earnings:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }

    return this.data || { earnings: [], totalEarnings: 0 };
  }

  public async getByDateRange(startDate: string, endDate: string): Promise<SystemEarning[]> {
    try {
      this.loading = true;
      const response = await NETWORK.get(`/api/system/earnings/daterange?startDate=${startDate}&endDate=${endDate}`, {
        throwError: true,
      });

      if (response && response.is_successful && response.data) {
        return response.data as SystemEarning[];
      } else {
        throw new Error('Failed to fetch system earnings data by date range');
      }
    } catch (error) {
      console.error('Error fetching system earnings by date range:', error);
      throw error;
    } finally {
      this.loading = false;
    }
  }

  public isLoading(): boolean {
    return this.loading;
  }

  public invalidate(): void {
    this.data = null;
  }
}
