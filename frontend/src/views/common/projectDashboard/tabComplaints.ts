import { DiscussionView } from '@/views/discussion/Discussion';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { Discussion as DiscussionData } from '@/data/discussion/discussion';
import { ProjectDiscussionCache } from '@/data/discussion/cache/project_discussion';

export default class Complaints {
  private projectId: string;
  private complaints: DiscussionData[];
  private selectedComplaintId: string | null = null;
  private complaintContainer!: Quark;

  constructor(projectId: string) {
    this.projectId = projectId;
    this.complaints = [];
  }

  private async fetchComplaints() {
    const discussions = new ProjectDiscussionCache(this.projectId);
    const allDiscussions = await discussions.get();
    this.complaints = allDiscussions.filter((discussion) => discussion.title.toLowerCase().startsWith('complaint:'));
  }

  render(q: Quark): void {
    $(q, 'div', 'bg-secondary rounded w-100 d-flex align-items-center justify-content-start flex-column rounded-3 border-secondary-thick', { style: 'overflow-y: hidden;' }, (q) => {
      // Main content area with side navigation and content
      $(q, 'div', 'w-100 d-flex', {}, (q) => {
        // Left side navigation (1/4 of the space)
        $(q, 'div', 'col-3 d-flex flex-column align-items-center justify-content-start border-right-1', {}, (q) => {
          this.renderComplaintsList(q);
        });

        // Right side content area (3/4 of the space)
        this.complaintContainer = $(q, 'div', 'col-9 d-flex flex-column align-items-center justify-content-start', {}, (q) => {
          $(q, 'div', 'text-center py-4 text-primary', {}, 'Select a complaint to view');
        });
      });
    });
  }

  private renderComplaintsList(q: Quark): void {
    this.fetchComplaints().then(() => {
      // Clear previous content
      q.innerHTML = '';

      if (this.complaints.length === 0) {
        $(q, 'span', 'text-center p-3', {}, 'No complaints available');
        return;
      }

      $(q, 'span', 'd-flex align-items-center justify-content-center flex-column w-100', {}, (q) => {
        this.complaints.forEach((complaint, index) => {
          $(
            q,
            'span',
            'text-center w-100 p-2 text-primary cursor-pointer complaint-buttons hover-bg-tertiary' +
              (index < this.complaints.length - 1 ? ' border-bottom-1' : '') +
              (this.selectedComplaintId === complaint.id ? ' bg-primary' : ' bg-secondary'),
            {
              onclick: () => this.showComplaint(complaint.id),
              id: `complaint-${complaint.id}`,
            },
            complaint.title
          );
        });
      });
    });
  }

  private showComplaint(complaintId: string): void {
    // Update selected complaint
    this.selectedComplaintId = complaintId;

    // Update button styling
    document.querySelectorAll('.complaint-buttons').forEach((button) => {
      button.classList.remove('bg-primary');
      button.classList.add('bg-secondary');
    });

    document.getElementById(`complaint-${complaintId}`)?.classList.add('bg-primary');
    document.getElementById(`complaint-${complaintId}`)?.classList.remove('bg-secondary');

    // Clear complaint container
    if (this.complaintContainer) {
      this.complaintContainer.innerHTML = '';

      // Render selected complaint
      const discussionView = new DiscussionView({ discussionId: complaintId });
      discussionView.render(this.complaintContainer);
    }
  }
}
