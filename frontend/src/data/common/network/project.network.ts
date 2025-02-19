import NETWORK, {Response} from "@data/network/network";

export class ProjectEndpoints {
    private static readonly BASE_URL = '/api/projects';

    static async getProject(projectId: string): Promise<Response> {
        return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}/${projectId}`);
    }
}