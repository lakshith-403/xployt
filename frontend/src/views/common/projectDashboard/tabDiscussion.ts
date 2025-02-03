import { DiscussionView } from '@/views/discussion/Discussion';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { Discussion as DiscussionData } from '@/data/discussion/discussion';
import { ProjectDiscussionCache } from '@/data/discussion/cache/project_discussion';
import { CollapsibleBase } from '@/components/Collapsible/collap.base';

export default class Discussion {
  private projectId: string;
  private discussions: DiscussionData[];

  constructor(projectId: string) {
    this.projectId = projectId;
    this.discussions = [];
  }

  private async fetchDiscussions() {
    const discussions = new ProjectDiscussionCache(this.projectId);
    this.discussions = await discussions.get();
  }

  render(q: Quark): void {
    this.fetchDiscussions().then(() => {
      this.discussions.forEach((discussion) => {
        const collapsible = new CollapsibleBase(discussion.title);
        collapsible.render(q);
        // @ts-ignore
        const discussionView = new DiscussionView({ discussionId: discussion.id });
        $(collapsible.content!, 'div', '', {}, (q) => {
          discussionView.render(q);
        });
      });
    });
  }
}
