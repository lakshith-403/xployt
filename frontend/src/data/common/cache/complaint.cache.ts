import { CacheObject, DataFailure } from '@/data/cacheBase';
import { Complaint } from '../complaint';
import { ComplaintEndpoints } from '../network/complaint';

export class ComplaintCache extends CacheObject<Complaint> {
  private complaintId: string;

  constructor(complaintId: string) {
    super();
    this.complaintId = complaintId;
  }

  async load(): Promise<Complaint> {
    let response = await ComplaintEndpoints.getComplaint(this.complaintId);
    response.is_successful = true;
    response.data = response;

    if (!response.is_successful) {
      throw new DataFailure('load complaint', response.error ?? '');
    }

    const complaint = response.data as Complaint;

    // Ensure date is parsed correctly
    if (complaint.createdAt && typeof complaint.createdAt === 'string') {
      complaint.createdAt = new Date(complaint.createdAt);
    }

    return complaint;
  }
}

export class ComplaintsCache extends CacheObject<Complaint[]> {
  async load(): Promise<Complaint[]> {
    const response = await ComplaintEndpoints.getComplaints();

    if (!response.is_successful) {
      throw new DataFailure('load complaints', response.error ?? '');
    }

    const complaints = response.data as Complaint[];

    // Ensure dates are parsed correctly
    complaints.forEach((complaint) => {
      if (complaint.createdAt && typeof complaint.createdAt === 'string') {
        complaint.createdAt = new Date(complaint.createdAt);
      }
    });

    return complaints;
  }
}

export class ComplaintByDiscussionCache extends CacheObject<Complaint> {
  private discussionId: string;

  constructor(discussionId: string) {
    super();
    this.discussionId = discussionId;
  }

  async load(): Promise<Complaint> {
    const response = await ComplaintEndpoints.getComplaintByDiscussionId(this.discussionId);

    if (!response.is_successful) {
      throw new DataFailure('load complaint by discussion id', response.error ?? '');
    }

    const complaint = response.data as Complaint;

    // Ensure date is parsed correctly
    if (complaint.createdAt && typeof complaint.createdAt === 'string') {
      complaint.createdAt = new Date(complaint.createdAt);
    }

    return complaint;
  }
}
