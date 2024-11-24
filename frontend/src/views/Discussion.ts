import { View, ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '../ui_lib/quark';
import { Discussion, Attachment, Message, PublicUser, getAttachmentsUtil } from '@/data/discussion/discussion';
import { TextAreaBase } from '@/components/test_area/textArea.base';
import { IconButton } from '@/components/button/icon.button';
import { DiscussionCache } from '@/data/discussion/cache/discussion';
import { CACHE_STORE } from '@/data/cache';

class UserTag {
  private user: PublicUser;

  constructor(user: PublicUser) {
    this.user = user;
  }

  render(q: Quark): void {
    $(q, 'span', 'user-row', {}, (q) => {
      $(q, 'span', '', {}, (q) => {
        $(q, 'img', '', { src: '' });
        $(q, 'span', '', {}, this.user.name);
      });
      $(q, 'span', 'type', {}, '');
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

class DiscussionView extends View {
  private readonly discussionId: string;
  private readonly discussionCache: DiscussionCache;
  private discussion: Discussion | null = null;
  private participantPane!: Quark;
  private attachmentsPane!: Quark;
  private messagesPane!: Quark;

  constructor() {
    super();
    this.discussionId = 'discussion1';
    this.discussionCache = CACHE_STORE.getDiscussion(this.discussionId);
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

    this.discussionCache.get().then((discussion) => {
      this.discussion = discussion;

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
      this.discussion?.participants.forEach((participant) => {
        new UserTag(participant).render(q);
      });
    });
  }

  private renderAttachments(): void {
    this.attachmentsPane.innerHTML = '';
    $(this.attachmentsPane, 'h2', '', {}, 'Attachments');
    $(this.attachmentsPane, 'hr', '', {});
    $(this.attachmentsPane, 'div', 'attachment-list', {}, (q) => {
      getAttachmentsUtil(this.discussion!).forEach((attachment) => {
        new AttachmentTag(attachment).render(q);
      });
    });
  }

  private renderMessages(): void {
    this.messagesPane.innerHTML = '';
    $(this.messagesPane, 'div', 'message-list', {}, (q) => {
      this.discussion?.messages.forEach((message) => {
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
