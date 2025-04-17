import { DiscussionView } from '@/views/discussion/Discussion';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { Discussion as DiscussionData } from '@/data/discussion/discussion';
import { ProjectDiscussionCache } from '@/data/discussion/cache/project_discussion';

export default class Discussion {
  private projectId: string;
  private discussions: DiscussionData[];
  private selectedDiscussionId: string | null = null;
  private discussionContainer!: Quark;

  constructor(projectId: string) {
    this.projectId = projectId;
    this.discussions = [];
  }

  private async fetchDiscussions() {
    const discussions = new ProjectDiscussionCache(this.projectId);
    const allDiscussions = await discussions.get();
    this.discussions = allDiscussions.filter((discussion) => !discussion.title.toLowerCase().startsWith('complaint:'));
  }

  render(q: Quark): void {
    $(q, 'div', 'bg-secondary rounded w-100 d-flex align-items-center justify-content-start flex-column rounded-3 border-secondary-thick', { style: 'overflow-y: hidden;' }, (q) => {
      // Main content area with side navigation and content
      $(q, 'div', 'w-100 d-flex', {}, (q) => {
        // Left side navigation (1/4 of the space)
        $(q, 'div', 'col-3 d-flex flex-column align-items-center justify-content-start border-right-1', {}, (q) => {
          this.renderDiscussionsList(q);
        });

        // Right side content area (3/4 of the space)
        this.discussionContainer = $(q, 'div', 'col-9 d-flex flex-column align-items-center justify-content-start', {}, (q) => {
          $(q, 'div', 'text-center py-4 text-primary', {}, 'Select a discussion to view');
        });
      });
    });
  }

  private renderDiscussionsList(q: Quark): void {
    this.fetchDiscussions().then(() => {
      // Clear previous content
      q.innerHTML = '';

      if (this.discussions.length === 0) {
        $(q, 'span', 'text-center p-3', {}, 'No discussions available');
        return;
      }

      $(q, 'span', 'd-flex align-items-center justify-content-center flex-column w-100', {}, (q) => {
        this.discussions.forEach((discussion, index) => {
          $(
            q,
            'span',
            'text-center w-100 p-2 text-primary cursor-pointer discussion-buttons hover-bg-tertiary' +
              (index < this.discussions.length - 1 ? ' border-bottom-1' : '') +
              (this.selectedDiscussionId === discussion.id ? ' bg-primary' : ' bg-secondary'),
            {
              onclick: () => this.showDiscussion(discussion.id),
              id: `discussion-${discussion.id}`,
            },
            discussion.title
          );
        });
      });
    });
  }

  private showDiscussion(discussionId: string): void {
    // Update selected discussion
    this.selectedDiscussionId = discussionId;

    // Update button styling
    document.querySelectorAll('.discussion-buttons').forEach((button) => {
      button.classList.remove('bg-primary');
      button.classList.add('bg-secondary');
    });

    document.getElementById(`discussion-${discussionId}`)?.classList.add('bg-primary');
    document.getElementById(`discussion-${discussionId}`)?.classList.remove('bg-secondary');

    // Clear discussion container
    if (this.discussionContainer) {
      this.discussionContainer.innerHTML = '';

      // Render selected discussion
      const discussionView = new DiscussionView({ discussionId });
      discussionView.render(this.discussionContainer);
    }
  }
}
