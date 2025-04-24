import { View, ViewHandler } from '@ui_lib/view';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { DiscussionView } from '@/views/discussion/Discussion';
import { Complaint } from '@/data/common/complaint';
import { CACHE_STORE } from '@/data/cache';
import { Loader } from '@views/discussion/Loader';
import NotFound from '@components/notFound/notFound';
import { router } from '@ui_lib/router';
import { Button, ButtonType } from '@components/button/base';
import { formatDate } from '@/utils/formatters';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { ComplaintEndpoints } from '@/data/common/network/complaint';

export class ComplaintView extends View {
  private readonly complaintId: string;
  private complaint: Complaint | null = null;
  private loader: Loader;
  private discussionView: DiscussionView | null = null;

  constructor(params: { complaintId: string }) {
    super(params);
    this.complaintId = params.complaintId;
    this.loader = new Loader();
  }

  protected shouldRenderBreadcrumbs(): boolean {
    return true;
  }

  protected setupBreadcrumbs(params: { complaintId: string }): void {
    if (!this.complaint) return;

    this.breadcrumbs?.clearBreadcrumbs();
    this.breadcrumbs?.addBreadcrumb({
      label: `Projects`,
      link: `/projects`,
    });
    this.breadcrumbs?.addBreadcrumb({
      label: `Project #${this.complaint.projectId}`,
      link: `/projects/${this.complaint.projectId}`,
    });
    this.breadcrumbs?.addBreadcrumb({
      label: `Complaint #${this.complaint.id}`,
      link: `/complaint/${params.complaintId}`,
    });
  }

  private async loadData(): Promise<void> {
    try {
      // Fetch the complaint data
      this.complaint = await CACHE_STORE.getComplaint(this.complaintId).get();

      console.log(this.complaint);

      if (this.complaint) {
        // Create discussion view after getting the discussion ID
        this.discussionView = new DiscussionView({ discussionId: this.complaint.discussionId });

        // Setup breadcrumbs after getting project ID
        this.setupBreadcrumbs({ complaintId: this.complaintId });
      }
    } catch (error) {
      console.error('Failed to load complaint:', error);
    }
  }

  async render(q: Quark) {
    this.loader.show(q);
    await this.loadData();
    this.loader.hide();

    if (!this.complaint) {
      new NotFound().render(q);
      return;
    }

    $(q, 'div', 'complaint-container d-flex flex-column px-4 py-4', {}, async (q) => {
      $(q, 'div', 'complaint-header pb-2', {}, (q) => {
        $(q, 'h2', 'title', {}, this.complaint?.title || 'Complaint');
        $(q, 'h3', 'subtitle', {}, `Complaint #${this.complaint?.id}`);
      });

      // Complaint details
      $(q, 'div', 'complaint-details bg-secondary rounded-3 p-3 mb-3', {}, (q) => {
        $(q, 'div', 'detail-row d-flex justify-content-between mb-2', {}, (q) => {
          $(q, 'span', 'detail-label', {}, 'Status:');
          $(q, 'span', `detail-value ${this.complaint?.resolved ? 'text-success' : 'text-warning'}`, {}, this.complaint?.resolved ? 'Resolved' : 'Open');
        });

        $(q, 'div', 'detail-row d-flex justify-content-between mb-2', {}, (q) => {
          $(q, 'span', 'detail-label', {}, 'Created On:');
          $(q, 'span', 'detail-value', {}, formatDate(this.complaint?.createdAt));
        });

        $(q, 'div', 'detail-row d-flex flex-column mb-2', {}, (q) => {
          $(q, 'span', 'detail-label mb-1', {}, 'Notes:');
          $(q, 'div', 'detail-value p-2 bg-tertiary rounded', {}, this.complaint?.notes || 'No notes provided');
        });

        // Add resolve button for authorized users (this would need proper authorization logic)
        if (!this.complaint?.resolved) {
          $(q, 'div', 'd-flex justify-content-end mt-3', {}, (q) => {
            new Button({
              label: 'Resolve Complaint',
              type: ButtonType.PRIMARY,
              onClick: () => this.resolveComplaint(),
            }).render(q);
          });
        }
      });

      $(q, 'div', 'complaint-content bg-secondary rounded-3 p-3', {}, async (q) => {
        $(q, 'h4', 'mb-3', {}, 'Discussion');
        // Render the discussion for this complaint
        if (this.discussionView) {
          await this.discussionView.render(q);
        } else {
          $(q, 'div', 'text-center py-4 text-primary', {}, 'Discussion not available');
        }
      });
    });
  }

  private async resolveComplaint() {
    if (!this.complaint) return;

    try {
      LoadingScreen.show();
      await CACHE_STORE.getComplaint(this.complaintId).invalidate_cache();
      const response = await ComplaintEndpoints.resolveComplaint(this.complaint.discussionId);

      if (response.is_successful) {
        // Refresh the page to show resolved status
        router.navigateTo(`/complaint/${this.complaintId}`);
      } else {
        console.error('Failed to resolve complaint:', response.error);
      }
      LoadingScreen.hide();
    } catch (error) {
      console.error('Error resolving complaint:', error);
      LoadingScreen.hide();
    }
  }
}

export const complaintViewHandler = new ViewHandler('', ComplaintView);
