import NETWORK, { Response } from '@/data/network/network';

export class ComplaintEndpoints {
  private static readonly BASE_URL = '/api/complaints';

  static async getComplaints(): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', this.BASE_URL);
  }

  static async getComplaint(complaintId: string): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}/${complaintId}`);
  }

  static async getComplaintByDiscussionId(discussionId: string): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}/discussion/${discussionId}`);
  }

  static async createComplaint(complaint: any): Promise<Response> {
    return NETWORK.sendHttpRequest('POST', this.BASE_URL, complaint);
  }

  static async resolveComplaint(discussionId: string): Promise<Response> {
    return NETWORK.sendHttpRequest('DELETE', `${this.BASE_URL}/${discussionId}`);
  }
}
