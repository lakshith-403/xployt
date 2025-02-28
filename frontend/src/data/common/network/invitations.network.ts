import NETWORK, {Response} from "@data/network/network";

export class InvitationEndpoints {
    static async getHackerInvitations(userId: string): Promise<Response> {
        return NETWORK.sendHttpRequest(
            'GET',
            `/api/invitations/hacker/${userId}`
        );
    }

    static async getProjectInvitations(projectId: string): Promise<Response>{
        return NETWORK.sendHttpRequest(
            'GET',
            `/api/invitations/project/${projectId}`
        )
    }

    static async createInvitation(projectId: string, hackerId: string){
        return NETWORK.sendHttpRequest(
            'POST',
            '/api/invitations/hacker',
            {
                projectId: projectId,
                hackerId: hackerId
            }
        )
    }
    static async acceptInvitation(projectId: string, hackerId: string, accept: boolean){
        return NETWORK.sendHttpRequest(
            'PUT',
            `/api/invitations/hacker/`,
            {
                projectId: projectId,
                hackerId: hackerId,
                accept: accept
            }
        )
    }

    static async filterHackers(projectId: string){
        return NETWORK.sendHttpRequest(
            'GET',
            `/api/invitations/filter/${projectId}`
        )
    }
}