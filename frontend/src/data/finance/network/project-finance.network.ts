import NETWORK, { Response } from '../../network/network';

export class projectFinanceEndpoints {
  private static readonly BASE_URL = '/api/project-finance';

  static async getProjectReports(projectId: number): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}/${projectId}`);
  }

  static async makePayment(projectId: number, reportId: number, clientId: number): Promise<Response> {
    return NETWORK.sendHttpRequest('POST', `${this.BASE_URL}/${projectId}/pay`, {
      reportId,
      clientId,
    });
  }
}
