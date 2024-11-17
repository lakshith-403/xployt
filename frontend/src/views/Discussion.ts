import { View, ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '../ui_lib/quark';
import { User } from '@/data/user';
import Discussion, { Attachment, Message } from '@/data/discussion/discussion';
import { TextAreaBase } from '@/components/test_area/textArea.base';
import { IconButton } from '@/components/button/icon.button';

class UserTag {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  render(q: Quark): void {
    $(q, 'span', 'user-row', {}, (q) => {
      $(q, 'span', '', {}, (q) => {
        $(q, 'img', '', { src: this.user.avatar });
        $(q, 'span', '', {}, this.user.name);
      });
      $(q, 'span', 'type', {}, this.user.type);
    });
  }
}

class AttachmentTag {
  private attachment: Attachment;

  constructor(attachment: Attachment) {
    this.attachment = attachment;
  }

  render(q: Quark): void {
    $(q, 'div', 'attachment-tag', {}, (q) => {
      $(q, 'span', 'icon', {}, (q) => {
        $(q, 'i', 'fa-solid fa-newspaper', {});
      });
      $(q, 'span', 'name', {}, this.attachment.name);
    });
  }
}

class MessageComponent {
  private message: Message;

  constructor(message: Message) {
    this.message = message;
  }

  render(q: Quark): void {
    $(q, 'div', 'message-component', {}, (q) => {
      $(q, 'div', 'message-body', {}, (q) => {
        $(q, 'div', 'thread-line', {}, (q) => {
          if (this.message.type === 'user') {
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
          if (this.message.type === 'user') {
            $(q, 'span', 'sender-name', {}, this.message.sender.name);
          } else {
            $(q, 'span', 'sender-name', {}, this.message.content);
          }
          $(q, 'span', 'timestamp', {}, this.getTimeAgo(this.message.timestamp));
        });

        if (this.message.type === 'user') {
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

  private getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - timestamp.getTime());
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

class DiscussionView extends View {
  private discussion: Discussion;
  private participantPane!: Quark;
  private attachmentsPane!: Quark;
  private messagesPane!: Quark;
  constructor() {
    super();
    this.discussion = new Discussion('1234');
  }

  render(q: Quark): void {
    $(q, 'div', 'discussion-view', {}, (q) => {
      $(q, 'h1', '', {}, 'Project Name #1234');
      $(q, 'div', 'main-pain', {}, (q) => {
        this.messagesPane = $(q, 'div', 'messages-pane', {}, (q) => {});
        $(q, 'div', 'right-pane', {}, (q) => {
          this.participantPane = $(q, 'div', 'participants-pane', {}, (q) => {
            $(q, 'h2', '', {}, 'Participants');
            $(q, 'hr', '', {});
          });
          this.attachmentsPane = $(q, 'div', 'attachments-pane', {}, (q) => {});
        });
      });
    });

    this.discussion.load().then(() => {
      this.renderParticipants();
      this.renderAttachments();
      this.renderMessages();
    });
  }

  private renderParticipants(): void {
    this.participantPane.innerHTML = '';
    $(this.participantPane, 'h2', '', {}, 'Participants');
    $(this.participantPane, 'hr', '', {});
    $(this.participantPane, 'div', 'participant-list', {}, (q) => {
      this.discussion.getParticipants().forEach((participant) => {
        new UserTag(participant).render(q);
      });
    });
  }

  private renderAttachments(): void {
    this.attachmentsPane.innerHTML = '';
    $(this.attachmentsPane, 'h2', '', {}, 'Attachments');
    $(this.attachmentsPane, 'hr', '', {});
    $(this.attachmentsPane, 'div', 'attachment-list', {}, (q) => {
      this.discussion.getAttachments().forEach((attachment) => {
        new AttachmentTag(attachment).render(q);
      });
    });
  }

  private renderMessages(): void {
    this.messagesPane.innerHTML = '';
    $(this.messagesPane, 'div', 'message-list', {}, (q) => {
      this.discussion.getMessages().forEach((message) => {
        new MessageComponent(message).render(q);
      });

      new TextAreaBase({
        placeholder: 'Enter your message',
        name: 'message',
      }).render(q);

      $(q, 'div', 'button-row', {}, (q) => {
        new IconButton({
          icon: 'fa-solid fa-paperclip',
          label: 'Attach',
          onClick: () => {
            console.log('attach');
          },
        }).render(q);

        new IconButton({
          icon: 'fa-solid fa-paper-plane',
          label: 'Send',
          onClick: () => {
            console.log('send');
          },
        }).render(q);
      });
    });
  }
}

export const discussionViewHandler = new ViewHandler('discussion', DiscussionView);
