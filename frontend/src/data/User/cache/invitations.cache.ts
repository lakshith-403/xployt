import { CacheObject, DataFailure } from '../../cacheBase';
import { invitationEndpoints } from '../network/invitations.network';

interface InvitationDetails {
  id: number;
  date: string;
  description: string;
  status: 'accepted' | 'pending';
}

interface InvitationResponse {
  data: InvitationDetails[];
  is_successful: boolean;
  error?: string;
}

export class Invitation {
  id: number;
  date: string;
  description: string;
  status: string;

  constructor(data: InvitationDetails) {
    this.id = data.id;
    this.date = data.date;
    this.description = data.description;
    this.status = data.status;
  }
}

export class InvitationsCache extends CacheObject<Invitation[]> {
  acceptInvitation(invitationId: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async get(isRefresh?: boolean, userId: number = 0): Promise<Invitation[]> {
    const response = (await invitationEndpoints.getInvitations(userId)) as InvitationResponse;

    if (!response.is_successful) throw new DataFailure('load invitations', response.error ?? '');

    return response.data.map((invitation: InvitationDetails) => new Invitation(invitation));
  }

  // Implement the load method
  async load(forceReload: boolean, userId: number): Promise<Invitation[]> {
    // You can call the get method or implement the logic directly here
    return this.get(forceReload, userId);
  }
}

// Mock class for testing purposes
export class InvitationsCacheMock extends CacheObject<Invitation[]> {
  async load(forceReload: boolean, userId: number): Promise<Invitation[]> {
    return [
      new Invitation({
        id: 1,
        date: '2023-10-01',
        description: 'Invitation to project A',
        status: 'pending',
      }),
      new Invitation({
        id: 2,
        date: '2023-10-02',
        description: 'Invitation to project B',
        status: 'accepted',
      }),
      new Invitation({
        id: 3,
        date: '2023-10-03',
        description: 'Invitation to project C',
        status: 'pending',
      }),
    ];
  }

  acceptInvitation(invitationId: number): Promise<void> {
    return new Promise((resolve) => {
      console.log(`Mock: Accepted invitation with ID ${invitationId}`);
      resolve();
    });
  }
}