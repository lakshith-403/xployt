import NETWORK, { Response } from './../../network/network';

export class projectEndpoints {
  static async getAllProjects(userId: string): Promise<Response> {
    console.log('GET /api/lead/projects/:userId');
    return NETWORK.sendHttpRequest('GET', `/api/lead/projects/${userId}`);
  }
}
