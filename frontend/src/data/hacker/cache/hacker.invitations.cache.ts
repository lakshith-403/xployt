import {CacheObject, DataFailure} from '../../cacheBase';
import {Invitation, InvitationInfo, InvitationsResponse} from "@data/common/cache/invitations.cache";
import {InvitationEndpoints} from "@data/common/network/invitations.network";

export class HackerInvitationsCache extends CacheObject<Invitation[]>{
    private hackerId;

    constructor(hackerId: string) {
        super();
        this.hackerId = hackerId;
    }

    async load(hackerId: string): Promise<Invitation[]> {
        console.log(`Loading invitations of hacker ${hackerId}`);
        let res: InvitationsResponse;

        try {
            res = (await InvitationEndpoints.getHackerInvitations(this.hackerId)) as InvitationsResponse;
        } catch (error) {
            console.log('Network error while fetching invitations', error);
            throw new DataFailure('load invitations', 'Network error')
        }

        if (!res.is_successful) {
            console.error('Failed to load invitations:', res.error);
            throw new DataFailure('load invitation', res.error ?? '');
        }

        if (!Array.isArray(res.data)) {
            console.error('Unexpected data format:', res.data);
            throw new Error('Invalid API response: Expected an array');
        }

        return res.data;
    }

    async accept(projectId: string, hackerId: string, accept: boolean): Promise<Invitation[]> {
        console.log(`Accepting invitation for project ${projectId} and hacker ${hackerId}`);
        let res: InvitationsResponse;
        try {
            res = await InvitationEndpoints.acceptInvitation(projectId, hackerId, accept);
            console.log(res)
        } catch (error) {
            console.error('Failed to accept invitation:', error);
            throw new DataFailure('accept invitation', 'Network error');
        }
        if (!res.is_successful) {
            console.error('Failed to load invitations:', res.error);
            throw new DataFailure('load invitation', res.error ?? '');
        }

        // if (!Array.isArray(res.data)) {
        //     console.error('Unexpected data format:', res.data);
        //     throw new Error('Invalid API response: Expected an array');
        // }

        return [res.data]
            .flat()
            .map((invitationInfo: InvitationInfo) => {
                return new Invitation({...invitationInfo});
            });
    }
}