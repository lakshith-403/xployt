import NETWORK, { Response } from './../../network/network';

export class projectInfoEndpoints {
  static async getProjectInfo(projectId: string): Promise<Response> {
    return NETWORK.sendHttpRequest(
      'GET',
      `/api/validator/project-info/${projectId}`
    );
  }
}
