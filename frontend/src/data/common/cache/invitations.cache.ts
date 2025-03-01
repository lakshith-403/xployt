import {CacheObject, DataFailure} from '../../cacheBase';
import {InvitationEndpoints} from "@data/common/network/invitations.network";

interface InvitationsResponse {
    data: InvitationInfo[];
    is_successful: boolean;
    error?: string;
    trace?: string;
}

interface InvitationInfo {
    hackerId: number;
    projectId: number;
    status: string;
    timestamp: string;
}

export interface Hacker {
    id: number,
    name: string,
    email: string,
    points: number,
}

interface FilteredHackersResponse {
    data: Hacker[],
    is_successful: false,
    error?: string,
    trace?: string,
}

export class Invitation {
    hackerId: number;
    projectId: number;
    status: string;
    timestamp: string;

    constructor(data: any) {
        this.hackerId = data['hackerId'];
        this.projectId = data['projectId'];
        this.status = data['status'];
        this.timestamp = data['timestamp'];
    }
}

export class InvitationsCache extends CacheObject<Invitation[]> {
    private hackerId;
    constructor(hackerId: string) {
        super();
        this.hackerId = hackerId;
    }
    async load(projectId: string): Promise<Invitation[]> {
        console.log(`Loading invitations of project ${projectId}`);
        let res: InvitationsResponse;

        try {
            res = (await InvitationEndpoints.getHackerInvitations(this.hackerId)) as InvitationsResponse;
            console.log("Cache: inv.data", res.data);
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

        return res.data
            .flat()
            .map((invitationInfo: InvitationInfo) => {
                return new Invitation({...invitationInfo});
            });
    }

    async create(projectId: string, hackerId: string): Promise<Invitation[]> {
        console.log(`Creating invitation for project ${projectId} and hacker ${hackerId}`);
        let res: InvitationsResponse;
        try {
            res = await InvitationEndpoints.createInvitation(projectId, hackerId);
            console.log(res)
        } catch (error) {
            console.error('Failed to create invitation:', error);
            throw new DataFailure('create invitation', 'Network error');
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

    async filterHackers(projectId: string): Promise<Hacker[]>{
        console.log("Filtering available Hackers for project ", projectId)
        let res : FilteredHackersResponse

        try{
            res = await InvitationEndpoints.filterHackers(projectId) as FilteredHackersResponse
            console.log("Filtered hackers:", res);
        }catch (error){
            console.error("Failed to filter hackers:", error);
            throw new DataFailure('filter hackers', 'Network error');
        }

        if(!res.is_successful){
            console.error('Failed to filter hackers:', res.error);
            throw new DataFailure('filter hackers', res.error ?? '');
        }

        return res.data;
    }
}