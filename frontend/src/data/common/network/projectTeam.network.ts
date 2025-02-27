import NETWORK, {Response} from "@data/network/network";

export class ProjectTeamEndpoints {
    static async getProjectTeam(projectId: string): Promise<Response>{
        return NETWORK.sendHttpRequest(
            'GET',
            `/api/project/team/${projectId}`
        );
    }

    static async getAssignedUser(requiredRole:string, projectId: string, userId: string){
        return NETWORK.sendHttpRequest(
            'GET',
            `/api/project/team/assign/${requiredRole}/${projectId}/${userId}`
        );
    }
}