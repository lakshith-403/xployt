import NETWORK, { Response } from '../../network/network';

export class financeEndpoints {
  private static readonly BASE_URL = '/api/finance';

  static async getUserBalance(userId: number): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}/${userId}`);
  }

  static async getUserTransactions(userId: number): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}/${userId}/transactions`);
  }

  static async addFunds(userId: number, amount: number, description: string): Promise<Response> {
    return NETWORK.sendHttpRequest('POST', `${this.BASE_URL}/${userId}/deposit`, {
      amount,
      description,
    });
  }

  static async withdrawFunds(userId: number, amount: number, description: string): Promise<Response> {
    return NETWORK.sendHttpRequest('POST', `${this.BASE_URL}/${userId}/withdraw`, {
      amount,
      description,
    });
  }
}
