import { View, ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { Discussion, getAttachmentsUtil } from '@/data/discussion/discussion';
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

  constructor() {
    super();
    this.discussionId = 'discussion1';
    this.discussionCache = CACHE_STORE.getDiscussion(this.discussionId);
    this.loader = new Loader();
  }

  render(q: Quark): void {
    $(q, 'div', 'discussion-view', {}, (q) => {
      this.titleElem = $(q, 'h1', '', {}, 'Project Name #1234');
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

    this.loader.show(q);

    this.discussionCache
      .get()
      .then((discussion) => {
        this.discussion = discussion;
        this.loader.hide();

        this.titleElem.innerText = `${this.discussion?.title} #${this.discussion?.id}`;

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
