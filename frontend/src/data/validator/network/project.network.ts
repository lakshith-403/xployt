import NETWORK, { Response } from './../../network/network';

export class projectEndpoints {
  static async getAllProjects(validatorId: string): Promise<Response> {
    return NETWORK.sendHttpRequest(
      'GET',
      `/api/validator/projects/${validatorId}`
    );
  }
}
