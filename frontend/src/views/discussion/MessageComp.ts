import { Message } from '@/data/discussion/discussion';
import { Quark, QuarkFunction as $ } from '@/ui_lib/quark';
import { AttachmentTag } from './AttachmentTag';
import { TextAreaBase } from '@/components/test_area/textArea.base';

export class MessageComponent {
  private message: Message;
  private attachmentContainer!: Quark;
  private isEditing: boolean;
  private optionMenu!: Quark;
  private messageContainer!: Quark;
  private readonly onSaveCallback: (message: Message) => void;
  private readonly onDeleteCallback: (message: Message) => void;

  private tempMessage: Message | null = null;

  constructor(message: Message, onSaveCallback: (message: Message) => void, onDeleteCallback: (message: Message) => void) {
    this.message = message;
    this.isEditing = false;
    this.onSaveCallback = onSaveCallback;
    this.onDeleteCallback = onDeleteCallback;
  }

  render(q: Quark): void {
    $(q, 'div', 'message-component', {}, (q) => {
      $(q, 'div', 'message-body', {}, (q) => {
        $(q, 'div', 'thread-line', {}, (q) => {
          if (this.message.type === 'text') {
            $(q, 'img', 'sender-avatar', { src: 'https://picsum.photos/seed/picsum/200/300' });
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
          $(q, 'span', 'options', {}, (q) => {
            $(q, 'span', 'timestamp', {}, this.getTimeAgo(this.message.timestamp));
            let elem = $(q, 'i', 'fa-solid fa-ellipsis-v', {}, (q) => {
              this.optionMenu = $(q, 'div', 'options-menu', {}, (q) => {
                let editButton = $(q, 'button', 'edit', {}, (q) => {
                  $(q, 'i', 'fa-solid fa-pen', {});
                });
                editButton.addEventListener('click', () => {
                  this.onEdit();
                });
                let deleteButton = $(q, 'button', 'delete', {}, (q) => {
                  $(q, 'i', 'fa-solid fa-trash', {});
                });
                deleteButton.addEventListener('click', () => {
                  this.onDelete();
                });
              });

              this.optionMenu.style.display = 'none';
            });
            elem.addEventListener('click', () => {
              this.toggleOptions();
            });
          });
        });

        if (this.message.type === 'text') {
          this.messageContainer = $(q, 'div', 'content', {});
        }
        this.attachmentContainer = $(q, 'div', 'attachments', {}, (q) => {});
      });
    });

    this.renderAttachments();
    this.renderMessage();
  }

  private toggleOptions(): void {
    this.optionMenu.style.display = this.optionMenu.style.display === 'none' ? 'block' : 'none';
  }

  private onEdit(): void {
    this.isEditing = true;
    this.tempMessage = { ...this.message };

    this.renderAttachments();
    this.renderMessage();
  }

  private onDelete(): void {
    this.onDeleteCallback(this.message);
  }

  private renderMessage(): void {
    this.messageContainer.innerHTML = '';
    if (this.isEditing) {
      new TextAreaBase({
        value: this.message.content,
        onChange: (content) => {
          this.tempMessage!.content = content;
        },
      }).render(this.messageContainer);
      $(this.messageContainer, 'button', 'save', {}, 'Save').addEventListener('click', () => {
        this.isEditing = false;
        this.message = { ...this.tempMessage! };
        this.onSaveCallback(this.message);

        this.renderMessage();
        this.renderAttachments();
      });
      $(this.messageContainer, 'button', 'cancel', {}, 'Cancel').addEventListener('click', () => {
        this.isEditing = false;
        this.renderMessage();
        this.renderAttachments();
      });
    } else {
      this.messageContainer.innerHTML = this.message.content;
    }
  }

  private renderAttachments(): void {
    this.attachmentContainer.innerHTML = '';
    let m = this.isEditing ? this.tempMessage : this.message;
    m!.attachments.forEach((attachment) => {
      new AttachmentTag(
        attachment,
        this.isEditing
          ? () => {
              this.tempMessage!.attachments = this.tempMessage!.attachments.filter((a) => a !== attachment);
              this.renderAttachments();
            }
          : undefined
      ).render(this.attachmentContainer);
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
