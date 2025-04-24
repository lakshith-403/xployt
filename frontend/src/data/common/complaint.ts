export interface Complaint {
  id: number;
  title: string;
  notes: string;
  projectId: string;
  createdBy: string;
  createdAt: Date;
  teamMembers: string[];
  discussionId: string;
  resolved: boolean;
}
