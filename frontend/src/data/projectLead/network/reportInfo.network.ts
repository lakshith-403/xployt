import NETWORK, { Response } from '../../network/network';

export class reportInfoEndpoints {
  static async getReportInfo(reportId: string): Promise<Response> {
    return NETWORK.sendHttpRequest(
      'GET',
      `/api/validator/report-info/${reportId}`
    );
  }
}