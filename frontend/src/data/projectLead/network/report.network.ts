import NETWORK, { Response } from '../../network/network';

export class reportEndpoints {
  static async getAllReports(userId: string): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', `/api/validator/reports/${userId}`);
  }
}
