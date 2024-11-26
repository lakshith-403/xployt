import { View, ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { Discussion, getAttachmentsUtil, Message } from '@/data/discussion/discussion';
import { TextAreaBase } from '@/components/test_area/textArea.base';
import { IconButton } from '@/components/button/icon.button';
import { DiscussionCache } from '@/data/discussion/cache/discussion';
import { CACHE_STORE } from '@/data/cache';
import { Loader } from './Loader';
import { UserTag } from './UserTag';
import { AttachmentTag } from './AttachmentTag';
import { MessageComponent } from './MessageComp';

class DiscussionView extends View {
  private readonly discussionId: string;
  private readonly discussionCache: DiscussionCache;
  private discussion: Discussion | null = null;
  private participantPane!: Quark;
  private attachmentsPane!: Quark;
  private messagesPane!: Quark;
  private titleElem!: Quark;
  private loader: Loader;
  private selectedFiles: File[] = [];
  private attachedFileContainer!: Quark;

  constructor() {
    super();
    this.discussionId = 'discussion1';
    this.discussionCache = CACHE_STORE.getDiscussion(this.discussionId);
    this.loader = new Loader();
  }

  render(q: Quark): void {
    $(q, 'div', 'discussion-view', {}, (q) => {
      this.titleElem = $(q, 'h1', '', {}, '');
      $(q, 'div', 'main-pain', {}, (q) => {
        this.messagesPane = $(q, 'div', 'messages-pane', {}, (q) => {});
        $(q, 'div', 'right-pane', {}, (q) => {
          this.participantPane = $(q, 'div', 'participants-pane', {}, (q) => {});
          this.attachmentsPane = $(q, 'div', 'attachments-pane', {}, (q) => {});
        });
      });
    });

    this.loader.show(q);

    this.discussionCache
      .get()
      .then((discussion) => {
        this.discussion = discussion;
        this.loader.hide();

        this.titleElem.innerText = `${this.discussion?.title} #${this.discussion?.projectId}`;

        this.renderParticipants();
        this.renderAttachments();
        this.renderMessages();
      })
      .catch(() => {
        this.loader.hide();
        console.error('Failed to load discussion');
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
      this.discussion?.messages
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .forEach((message) => {
          new MessageComponent(
            message,
            (message) => {
              this.discussionCache.saveMessage(message);
              this.renderMessages();
              this.renderAttachments();
            },
            (message) => {
              this.discussionCache.deleteMessage(message);
              this.discussion!.messages = this.discussion!.messages.filter((m) => m.id !== message.id);
              this.renderMessages();
              this.renderAttachments();
            }
          ).render(q);
        });

      const textArea = new TextAreaBase({
        placeholder: 'Enter your message',
        name: 'message',
      });
      textArea.render(q);

      $(q, 'div', 'button-row', {}, (q) => {
        new IconButton({
          icon: 'fa-solid fa-paperclip',
          label: 'Attach',
          onClick: () => {
            this.handleFileAttach();
          },
        }).render(q);

        new IconButton({
          icon: 'fa-solid fa-paper-plane',
          label: 'Send',
          onClick: () => {
            this.sendMessage(textArea.getValue());
            textArea.setValue('');
            this.selectedFiles = [];
            this.renderAttachedFiles();
          },
        }).render(q);
      });

      this.attachedFileContainer = $(q, 'div', 'attached-files', {}, (q) => {});
    });
  }

  private async sendMessage(content: string): Promise<void> {
    const message: Message = {
      content: content,
      id: crypto.randomUUID(),
      sender: {
        userId: '3',
        name: 'John Doe ge thaththa',
        email: 'lead1@example.com',
      },
      attachments: this.selectedFiles.map((file) => ({
        id: crypto.randomUUID(),
        type: 'other',
        url: URL.createObjectURL(file),
        name: file.name,
        uploadedBy: {
          userId: '3',
          name: 'John Doe ge thaththa',
          email: 'lead1@example.com',
        },
        uploadedAt: new Date(),
      })),
      timestamp: new Date().toISOString(),
      type: 'text',
      discussionId: this.discussionId,
    };

    try {
      this.loader.show(this.messagesPane);
      const sentMessage = await this.discussionCache.sendMessage(message, this.selectedFiles);
      console.log('Message sent:', sentMessage);
      this.loader.hide();
      this.renderMessages();
    } catch (error) {
      this.loader.hide();
      console.error('Failed to send message:', error);
    }
  }

  private renderAttachedFiles(): void {
    this.attachedFileContainer.innerHTML = '';
    this.selectedFiles.forEach((file) => {
      new AttachmentTag(
        {
          id: '',
          type: 'other',
          url: URL.createObjectURL(file),
          name: file.name,
          uploadedBy: {
            userId: '',
            name: '',
            email: '',
          },
          uploadedAt: new Date(),
        },
        () => {
          this.selectedFiles = this.selectedFiles.filter((f) => f !== file);
          this.renderAttachedFiles();
        }
      ).render(this.attachedFileContainer);
    });
  }

  private handleFileAttach(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.style.display = 'none';

    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        this.selectedFiles.push(...Array.from(files));
        console.log('Selected files:', this.selectedFiles);

        this.renderAttachedFiles();

        this.renderAttachedFiles();
      }
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }
}

export const discussionViewHandler = new ViewHandler('discussion', DiscussionView);
