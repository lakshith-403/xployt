import { DiscussionView } from '@/views/discussion/Discussion';
import { Quark } from '@ui_lib/quark';

export default class Discussion {
  constructor(private projectId: string) {}

  render(q: Quark): void {
    // @ts-ignore
    const discussion = new DiscussionView({ discussionId: undefined });
    discussion.render(q);
  }
}
