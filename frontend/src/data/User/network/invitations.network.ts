import NETWORK, { Response } from '../../network/network';

export class invitationEndpoints {
  /**
   * Fetch all invitations for a specific user.
   * 
   * @param {number} userId - The ID of the user to fetch invitations for.
   * @returns {Promise<Response>} - The server's response containing the invitations.
   */
  static async getInvitations(userId: number): Promise<Response> {
    // Send a GET request to fetch all invitations for the given userId.
    return NETWORK.sendHttpRequest('GET', `/api/validator/invitations/${userId}`);
  }

  /**
   * Accept a specific invitation.
   * 
   * @param {number} invitationId - The ID of the invitation to accept.
   * @returns {Promise<Response>} - The server's response confirming the action.
   */
  static async acceptInvitation(invitationId: number): Promise<Response> {
    // Send a POST request to accept the invitation with the given invitationId.
    return NETWORK.sendHttpRequest('POST', `/api/validator/invitations/${invitationId}/accept`);
  }
}
