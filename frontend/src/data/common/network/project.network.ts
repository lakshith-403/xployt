import NETWORK, {Response} from "@data/network/network";

export class ProjectEndpoints {
    private static readonly BASE_URL = '/api/project';

    static async getProject(projectId: string): Promise<Response> {
        return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}/${projectId}`);
    }

    static async getAllProjects(userId: string, userStatus: string): Promise<Response> {
        return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}s?userId=${userId}&userStatus=${userStatus}`);
    }

    static async getProjectSeverityLevels(projectId: string): Promise<Response> {
        return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}/severity-level/${projectId}`);
    }
}