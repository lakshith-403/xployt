import NETWORK, { Response } from './../../network/network';
import {DataFailure} from "@data/cacheBase";

export class projectEndpoints {
  static async getAllProjects(userId: string): Promise<Response> {
    console.log('GET /api/projects/:userId');
    return NETWORK.sendHttpRequest('GET', `/api/projects?userId=${userId}&userStatus=client`);
  }

  static async getProjectRequests(userId: string): Promise<Response> {
    console.log('GET /api/client/project/request/:userId');

    let response: any;

    try {
      response = await NETWORK.sendHttpRequest('GET', `/api/client/project/request/${userId}`);
      console.log('Response', response)
    } catch (error) {
      console.error('Network error while fetching projects:', error);
      throw new DataFailure('load project', 'Network error');
    }

    if (response.state !== 'success') {
      console.error('Failed to load projects:', response.error);
      throw new DataFailure('load project', response.error ?? '');
    }

    return response;
  }
}
