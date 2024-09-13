import NETWORK, { Response } from './../../network/network';

export class hackerProjectInfoEndpoints {
  static async getHackerProjectInfo(projectId: string): Promise<Response> {
    return NETWORK.sendHttpRequest(
      'GET',
      `/api/hacker/project-info/${projectId}`
    );
  }
}