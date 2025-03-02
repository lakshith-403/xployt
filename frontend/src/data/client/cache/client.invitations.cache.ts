import {CacheObject, DataFailure} from '../../cacheBase';
import {HackersResponse, Hacker} from "@data/common/cache/invitations.cache";
import {InvitationEndpoints} from "@data/common/network/invitations.network";

export class ClientInvitationsCache extends CacheObject<Hacker[]>{
    private projectId;

    constructor(projectId: string) {
        super();
        this.projectId = projectId;
    }

    async load(): Promise<Hacker[]> {
        console.log(`Loading invited hackers of project ${this.projectId}`);
        let res: HackersResponse;

        try{
            res = await InvitationEndpoints.getInvitedHackers(this.projectId) as HackersResponse
            console.log("Invited hackers:", res);
        }catch (error){
            console.error("Failed to get invited hackers:", error);
            throw new DataFailure('get invited hackers', 'Network error');
        }

        if(!res.is_successful){
            console.error('Failed to get invited hackers:', res.error);
            throw new DataFailure('invited hackers', res.error ?? '');
        }

        return res.data;
    }
}