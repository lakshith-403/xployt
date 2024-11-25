import { Attachment } from '@/data/discussion/discussion';
import { Quark, QuarkFunction as $ } from '@/ui_lib/quark';

export class AttachmentTag {
  private attachment: Attachment;

  constructor(attachment: Attachment) {
    this.attachment = attachment;
  }

  render(q: Quark): void {
    let elem = $(q, 'div', 'attachment-tag', {}, (q) => {
      $(q, 'span', 'icon', {}, (q) => {
        $(q, 'i', 'fa-solid fa-newspaper', {});
      });
      $(q, 'span', 'name', {}, this.attachment.name);
    });

    elem.addEventListener('click', () => {
      window.open(this.attachment.url, '_blank');
    });
  }
}
