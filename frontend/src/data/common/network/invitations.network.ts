import NETWORK, {Response} from "@data/network/network";

export class InvitationEndpoints {
    private static readonly BASE_URL = `/api/invitations`;
    static async getHackerInvitations(userId: string): Promise<Response> {
        return NETWORK.sendHttpRequest(
            'GET',
            `${this.BASE_URL}/hacker/${userId}`
        );
    }

    static async getProjectInvitations(projectId: string): Promise<Response>{
        return NETWORK.sendHttpRequest(
            'GET',
            `${this.BASE_URL}/project/${projectId}`
        )
    }

    static async createInvitation(projectId: string, hackerId: string){
        return NETWORK.sendHttpRequest(
            'POST',
            `${this.BASE_URL}/project`,
            {
                projectId: projectId,
                hackerId: hackerId
            }
        )
    }

    static async getInvitedHackers(projectId: string){
        return NETWORK.sendHttpRequest(
            'GET',
            `${this.BASE_URL}/client/${projectId}`
        )
    }
    static async acceptInvitation(projectId: string, hackerId: string, accept: boolean){
        return NETWORK.sendHttpRequest(
            'PUT',
            `${this.BASE_URL}/hacker/`,
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
            `${this.BASE_URL}/filter/${projectId}`
        )
    }
}