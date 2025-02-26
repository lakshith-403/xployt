import { Attachment } from '@/data/discussion/discussion';
import NETWORK from '@/data/network/network';
import { Quark, QuarkFunction as $ } from '@/ui_lib/quark';

export class AttachmentTag {
  private attachment: Attachment;
  private readonly onDelete?: () => void;

  constructor(attachment: Attachment, onDelete?: () => void) {
    this.attachment = attachment;
    this.onDelete = onDelete;
  }

  render(q: Quark): void {
    let elem = $(q, 'div', 'attachment-tag', {}, (q) => {
      $(q, 'span', 'icon', {}, (q) => {
        $(q, 'i', 'fa-solid fa-newspaper', {});
      });
      $(q, 'span', 'name', {}, this.attachment.name);
    });

    if (this.onDelete) {
      let deleteIcon = $(elem, 'span', 'delete', {}, (q) => {
        $(q, 'i', 'fa-solid fa-trash', {});
      });

      deleteIcon.addEventListener('click', (e) => {
        this.onDelete?.();
        e.stopPropagation();
      });
    }

    elem.addEventListener('click', () => {
      window.open(NETWORK.baseURL + '/uploads/' + this.attachment.url, '_blank');
    });
  }
}
