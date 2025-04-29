import { View, ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { Attachment, Discussion, getAttachmentsUtil, Message } from '@/data/discussion/discussion';
import { TextAreaBase } from '@/components/test_area/textArea.base';
import { IconButton } from '@/components/button/icon.button';
import { DiscussionCache } from '@/data/discussion/cache/discussion';
import { CACHE_STORE } from '@/data/cache';
import { Loader } from './Loader';
import { UserTag } from './UserTag';
import { AttachmentTag } from './AttachmentTag';
import { MessageComponent } from './MessageComp';
import { router } from '@/ui_lib/router';
import NETWORK from '@/data/network/network';
import { ProjectDiscussionCache } from '@/data/discussion/cache/project_discussion';
import { User } from '@data/user';

export class DiscussionView extends View {
  private readonly discussionId: string;
  private readonly discussionCache: DiscussionCache;
  private discussion: Discussion | null = null;
  private participantPane!: Quark;
  private attachmentsPane!: Quark;
  private messagesPane!: Quark;
  private titleElem!: Quark;
  private descriptionElem!: Quark;
  private loader: Loader;
  private selectedFiles: File[] = [];
  private attachedFileContainer!: Quark;
  private isResolved: boolean = false;
  private resolveButtonContainer: Quark | null = null;
  private projectDiscussionCache: ProjectDiscussionCache | null = null;
  private isAdmin: boolean = false;
  private currentUser!: User;

  constructor({ discussionId }: { discussionId: string }) {
    super();
    if (discussionId !== undefined) {
      this.discussionId = discussionId;
    } else {
      this.discussionId = 'discussion1';
    }

    console.log('discussionId', this.discussionId);
    this.discussionCache = CACHE_STORE.getDiscussion(this.discussionId);
    this.loader = new Loader();
  }

  async render(q: Quark): Promise<void> {
    $(q, 'div', 'discussion-view', {}, (q) => {
      this.titleElem = $(q, 'h1', '', {}, '');
      this.descriptionElem = $(q, 'div', 'discussion-description', {}, '');
      $(q, 'div', 'main-pain', {}, (q) => {
        this.messagesPane = $(q, 'div', 'messages-pane', {}, (q) => {});
        $(q, 'div', 'right-pane', {}, (q) => {
          this.participantPane = $(q, 'div', 'participants-pane', {}, (q) => {});
          this.attachmentsPane = $(q, 'div', 'attachments-pane', {}, (q) => {});
        });
      });
    });

    this.loader.show(q);

    try {
      // Check if current user is admin
      this.currentUser = await CACHE_STORE.getUser().get();
      this.isAdmin = this.currentUser.type === 'Admin';

      // Load the discussion data
      this.discussion = await this.discussionCache.get();

      // If this discussion belongs to a project, initialize project discussion cache
      if (this.discussion?.projectId) {
        this.projectDiscussionCache = new ProjectDiscussionCache(this.discussion.projectId);
      }

      this.titleElem.innerText = `${this.discussion?.title} #${this.discussion?.projectId}`;

      // Check if this is a complaint discussion
      if (this.discussion?.title.toLowerCase().startsWith('complaint:')) {
        // Fetch complaint status
        await this.checkComplaintStatus();
      }

      // Render the UI based on status
      this.renderParticipants();
      this.renderAttachments();
      this.renderMessages();
      await this.checkProjectLead();

      this.loader.hide();
    } catch (error) {
      this.loader.hide();
      console.error('Failed to load discussion:', error);
    }
  }

  private async checkComplaintStatus(): Promise<void> {
    if (!this.discussion) return;

    try {
      console.log(`Checking complaint status for discussion ${this.discussionId}`);

      const response = await NETWORK.get(`/api/complaints/discussion/${this.discussionId}`, {
        showLoading: false,
        handleError: false,
      });

      console.log('Complaint status response:', response);

      // Display notes if available
      if (response.notes) {
        this.descriptionElem.innerHTML = '';
        $(this.descriptionElem, 'h3', 'complaint-notes', {}, response.notes);
      }

      if (response.resolved) {
        this.isResolved = response.resolved;
        console.log(`Discussion ${this.discussionId} resolved status:`, this.isResolved);

        if (this.isResolved) {
          // Add the resolution notice to the UI
          $(this.titleElem.parentElement!, 'div', 'resolution-notice', {}, (q) => {
            $(q, 'p', '', {}, 'This complaint has been resolved. Further messages are disabled.');
          });
        }
      }
    } catch (error) {
      console.error('Error checking complaint status:', error);
    }
  }

  private renderParticipants(): void {
    this.participantPane.innerHTML = '';
    $(this.participantPane, 'h2', '', {}, 'Participants');
    $(this.participantPane, 'hr', '', {});
    $(this.participantPane, 'div', 'participant-list', {}, (q) => {
      this.discussion?.participants.forEach((participant) => {
        if (participant.userId === this.currentUser?.id) {
          participant.role = 'You';
        }
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
      if (this.isAdmin) {
        $(q, 'div', 'admin-notice', {}, (q) => {
          $(q, 'p', '', {}, 'You are viewing this discussion as an admin. Editing is disabled.');
        });
      }

      this.discussion?.messages
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .forEach((message) => {
          if (message.sender.userId === this.currentUser?.id) {
            message.sender.name = 'You';
          }
          if (this.isResolved || this.isAdmin) {
            // For resolved discussions or admin users, pass empty functions that do nothing
            new MessageComponent(
              message,
              () => {},
              () => {}
            ).render(q);
          } else {
            // For active discussions, pass regular callbacks
            new MessageComponent(
              message,
              (message) => {
                this.discussionCache.saveMessage(message).then(() => {
                  // Update local discussion data
                  this.discussion!.messages = this.discussion!.messages.map((m) => (m.id === message.id ? message : m));

                  // Update project cache if available
                  if (this.projectDiscussionCache && this.discussion) {
                    this.projectDiscussionCache.updateDiscussionInCache(this.discussion);
                  }

                  this.renderMessages();
                  this.renderAttachments();
                });
              },
              (message) => {
                this.discussionCache.deleteMessage(message).then(() => {
                  // Update local discussion data
                  this.discussion!.messages = this.discussion!.messages.filter((m) => m.id !== message.id);

                  // Update project cache if available
                  if (this.projectDiscussionCache && this.discussion) {
                    this.projectDiscussionCache.updateDiscussionInCache(this.discussion);
                  }

                  this.renderMessages();
                  this.renderAttachments();
                });
              }
            ).render(q);
          }
        });

      // Only render the input field if the discussion is not resolved and user is not admin
      if (!this.isResolved && !this.isAdmin) {
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
            onClick: async () => {
              await this.sendMessage(textArea.getValue());
              textArea.setValue('');
              this.selectedFiles = [];
              this.renderAttachedFiles();
            },
          }).render(q);
        });

        this.attachedFileContainer = $(q, 'div', 'attached-files', {}, (q) => {});
      }
    });
  }

  private async sendMessage(content: string): Promise<void> {
    const user = await CACHE_STORE.getUser().get();
    console.log(this.selectedFiles);

    if (content.trim() === '' && this.selectedFiles.length === 0) return;

    let attachments: Attachment[] = this.selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      type: 'other',
      url: '',
      name: file.name,
      uploadedBy: {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
      uploadedAt: new Date(),
    }));

    for (let i = 0; i < attachments.length; i++) {
      const attachment = attachments[i];
      attachments[i].url = attachment.id + '.' + attachment.name.split('.').pop();
    }

    // Create message and send it
    const message: Message = {
      id: crypto.randomUUID(),
      sender: {
        userId: user.id,
        name: user.name,
        email: user.email,
      },
      content: content,
      attachments: attachments,
      timestamp: new Date().toISOString(),
      type: 'text',
      discussionId: this.discussionId,
    };

    try {
      await this.discussionCache.sendMessage(message, this.selectedFiles);

      // Update project cache if available
      if (this.projectDiscussionCache && this.discussion) {
        this.projectDiscussionCache.updateDiscussionInCache(this.discussion);
      }

      this.renderMessages();
      this.renderAttachments();
    } catch (error) {
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
      }
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  private async checkProjectLead(): Promise<void> {
    if (!this.discussion) return;

    // Check if the discussion title has the 'complaint:' prefix
    if (!this.discussion.title.toLowerCase().startsWith('complaint:')) return;

    try {
      const currentUser = await CACHE_STORE.getUser().get();

      // If the user is a project lead and the discussion is not resolved, add the resolve button
      if (currentUser.type === 'ProjectLead' && !this.isResolved && !this.isAdmin) {
        this.resolveButtonContainer = $(this.titleElem.parentElement!, 'div', 'resolve-conflict-container', {});

        new IconButton({
          icon: 'fa-solid fa-check-circle',
          label: 'Resolve Conflict',
          onClick: async () => {
            try {
              this.loader.show(this.messagesPane);

              // Call the complaint resolution endpoint
              await NETWORK.delete(`/api/complaints/${this.discussionId}`);

              // Update the state and re-render
              this.isResolved = true;
              this.loader.hide();

              // Remove the resolve button
              if (this.resolveButtonContainer) {
                this.resolveButtonContainer.innerHTML = '';
                this.resolveButtonContainer.style.display = 'none';
              }

              // Re-render messages with readonly mode
              this.renderMessages();

              // Add resolution notice
              $(this.titleElem.parentElement!, 'div', 'resolution-notice', {}, (q) => {
                $(q, 'p', '', {}, 'This complaint has been resolved. Further messages are disabled.');
              });
            } catch (error) {
              this.loader.hide();
              console.error('Failed to resolve conflict:', error);
            }
          },
        }).render(this.resolveButtonContainer);
      }
    } catch (error) {
      console.error('Error checking project lead status:', error);
    }
  }
}

export const discussionViewHandler = new ViewHandler('discussion', DiscussionView);
