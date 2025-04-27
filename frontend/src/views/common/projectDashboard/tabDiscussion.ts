import { DiscussionView } from '@/views/discussion/Discussion';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { Discussion as DiscussionData } from '@/data/discussion/discussion';
import { ProjectDiscussionCache } from '@/data/discussion/cache/project_discussion';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';

export default class Discussion {
  private projectId: string;
  private discussions: DiscussionData[];
  private selectedDiscussionId: string | null = null;
  private discussionContainer!: Quark;
  private projectDiscussionCache: ProjectDiscussionCache;
  private loadingListContainer!: Quark;

  constructor(projectId: string) {
    this.projectId = projectId;
    this.discussions = [];
    this.projectDiscussionCache = new ProjectDiscussionCache(this.projectId);
  }

  private async fetchDiscussions() {
    try {
      LoadingScreen.show();
      const allDiscussions = await this.projectDiscussionCache.get();
      this.discussions = allDiscussions.filter((discussion) => !discussion.title.toLowerCase().startsWith('complaint:'));
      LoadingScreen.hide();
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
      LoadingScreen.hide();
    }
  }

  render(q: Quark): void {
    $(q, 'div', 'bg-secondary rounded w-100 d-flex align-items-center justify-content-start flex-column rounded-3 border-secondary-thick', { style: 'overflow-y: hidden;' }, (q) => {
      // Main content area with side navigation and content
      $(q, 'div', 'w-100 d-flex', {}, (q) => {
        // Left side navigation (1/4 of the space)
        this.loadingListContainer = $(q, 'div', 'w-10 d-flex flex-column align-items-center justify-content-start border-right-1', {}, (q) => {
          $(q, 'div', 'text-center py-4 text-primary', {}, 'Loading discussions...');
        });

        // Right side content area (3/4 of the space)
        this.discussionContainer = $(q, 'div', 'w-min-60 d-flex flex-column align-items-center justify-content-start', {}, (q) => {
          $(q, 'div', 'text-center py-4 text-primary', {}, 'Select a discussion to view');
        });
      });
    });

    // Fetch discussions after rendering initial structure
    this.renderDiscussionsList();
  }

  private renderDiscussionsList(): void {
    this.fetchDiscussions().then(() => {
      // Clear previous content
      this.loadingListContainer.innerHTML = '';

      if (this.discussions.length === 0) {
        $(this.loadingListContainer, 'span', 'text-center p-3', {}, 'No discussions available');
        return;
      }

      $(this.loadingListContainer, 'span', 'd-flex align-items-center justify-content-center flex-column w-100', {}, (q) => {
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
    LoadingScreen.show();

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
      discussionView
        .render(this.discussionContainer)
        .then(() => {
          LoadingScreen.hide();
        })
        .catch(() => {
          LoadingScreen.hide();
        });
    }
  }

  // Refresh discussions after a discussion is updated
  public refreshDiscussions(): void {
    this.projectDiscussionCache.invalidate_cache();
    this.renderDiscussionsList();
  }
}
