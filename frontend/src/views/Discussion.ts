import { View, ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '../ui_lib/quark';

class DiscussionView extends View {
  render(q: Quark): void {
    $(q, 'h1', '', {}, 'Discussion');
  }
}

export const discussionViewHandler = new ViewHandler('discussion', DiscussionView);
