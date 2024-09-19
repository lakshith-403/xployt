import { Invitation } from '../../../data/User/cache/invitations.cache';
import { tableBase } from '../../../components/table/table.base';
import './dashboard.scss'; // Ensure the CSS is imported

export class InvitationsTable {
  private invitations: Invitation[];
  private static readonly INVITATION_TABLE_HEADERS = ['Date', 'Description', 'Status'];

  constructor(invitations: Invitation[]) {
    this.invitations = invitations;
  }

  render(container: HTMLElement, acceptInvitation: (invitationId: number) => void): void {
    const invitationData = this.invitations.map(invitation => ({
      date: invitation.date,
      description: invitation.description,
      status: `<button class="accept-button" data-id="${invitation.id}">Accept</button>`
    }));

    const table = new tableBase(invitationData, InvitationsTable.INVITATION_TABLE_HEADERS, '');

    // Render the table
    table.render(container);

    // Add event listeners for the accept buttons
    this.invitations.forEach(invitation => {
      const button = container.querySelector(`.accept-button[data-id="${invitation.id}"]`);
      if (button) {
        button.addEventListener('click', () => acceptInvitation(invitation.id));
      }
    });
  }
}