import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';

interface TagItemOptions {
  tag: string;
  onRemove: (tag: string) => void;
}

export class TagItem {
  private tag: string;
  private onRemove: (tag: string) => void;

  constructor(options: TagItemOptions) {
    this.tag = options.tag;
    this.onRemove = options.onRemove;
  }

  render(q: Quark) {
    $(q, 'span', 'tag', {}, (q) => {
      $(q, 'span', '', {}, this.tag);
      $(q, 'span', 'remove-tag', {}, '×').addEventListener('click', () => {
        this.onRemove(this.tag);
      });
    });
  }
}
