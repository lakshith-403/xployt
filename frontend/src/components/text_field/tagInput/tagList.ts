import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { TagItem } from './tagItem';
import './tagList.scss';
interface TagListOptions {
  tags: string[];
  onRemove: (tag: string) => void;
  update: (tags: string[]) => void;
}

export class TagList {
  private tags: string[];
  private onRemove: (tag: string) => void;
  private container?: Quark;
  private update: (tags: string[]) => void;

  constructor(options: TagListOptions) {
    // console.log('Tags', options.tags);
    this.tags = options.tags;
    this.onRemove = options.onRemove;
    this.update = options.update;
  }

  updateTags(newTags: string[]) {
    // console.log('New Tags', newTags);
    this.tags = newTags;
    this.update(this.tags);
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
