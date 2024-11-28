import NETWORK, {Response} from "@data/network/network";

export class ProjectTeamEndpoints {
    static async getProjectTeam(projectId: string): Promise<Response>{
        return NETWORK.sendHttpRequest(
            'GET',
            `/api/project/team/${projectId}`
        );
    }
}