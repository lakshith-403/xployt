import { Message } from '@/data/discussion/discussion';
import { Quark, QuarkFunction as $ } from '@/ui_lib/quark';
import { AttachmentTag } from './AttachmentTag';

export class MessageComponent {
  private message: Message;

  constructor(message: Message) {
    this.message = message;
  }

  render(q: Quark): void {
    $(q, 'div', 'message-component', {}, (q) => {
      $(q, 'div', 'message-body', {}, (q) => {
        $(q, 'div', 'thread-line', {}, (q) => {
          if (this.message.type === 'text') {
            $(q, 'img', 'sender-avatar', { src: this.message.sender.avatar });
          } else if (this.message.type === 'complaint') {
            $(q, 'span', 'sender-avatar', {}, (q) => {
              $(q, 'i', 'fa-solid fa-exclamation-triangle', {});
            });
          } else if (this.message.type === 'report') {
            $(q, 'span', 'sender-avatar', {}, (q) => {
              $(q, 'i', 'fa-solid fa-file-alt', {});
            });
          }
        });

        $(q, 'div', 'message-header', {}, (q) => {
          if (this.message.type === 'text') {
            $(q, 'span', 'sender-name', {}, this.message.sender.name);
          } else {
            $(q, 'span', 'sender-name', {}, this.message.content);
          }
          $(q, 'span', 'timestamp', {}, this.getTimeAgo(this.message.timestamp));
        });

        if (this.message.type === 'text') {
          $(q, 'div', 'content', {}, this.message.content);
        }

        if (this.message.attachments.length > 0) {
          $(q, 'div', 'attachments', {}, (q) => {
            this.message.attachments.forEach((attachment) => {
              new AttachmentTag(attachment).render(q);
            });
          });
        }
      });
    });
  }

  private getTimeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.round(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.round(diffTime / (1000 * 60));
    if (diffDays > 0) {
      return `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hours ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minutes ago`;
    } else {
      return 'just now';
    }
  }
}
