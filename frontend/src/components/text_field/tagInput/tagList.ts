import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { TagItem } from './tagItem';

interface TagListOptions {
  tags: string[];
  onRemove: (tag: string) => void;
}

export class TagList {
  private tags: string[];
  private onRemove: (tag: string) => void;
  private container?: Quark;

  constructor(options: TagListOptions) {
    console.log('Tags', options.tags);
    this.tags = options.tags;
    this.onRemove = options.onRemove;
  }

  updateTags(newTags: string[]) {
    console.log('New Tags', newTags);
    this.tags = newTags;
    if (this.container) {
      this.container.innerHTML = ''; // Clear the container
      this.render(this.container); // Re-render the tags
    }
  }

  render(q: Quark) {
    this.container = $(q, 'div', 'tags-container', {}, (q) => {
      this.tags.forEach((tag, index) => {
        new TagItem({ tag, onRemove: this.onRemove }).render(q);
      });
    });
  }
}
