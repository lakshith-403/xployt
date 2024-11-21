import { DataFailure } from '../cacheBase';
import { User } from '../user';
import { MockDiscussionEndpoints as DiscussionEndpoints } from './network/discussion';

type AttachmentType = 'pdf' | 'image' | 'link' | 'report' | 'complaint';

export interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  uploadedBy: User;
  uploadedAt: Date;
}

export type MessageType = 'user' | 'complaint' | 'report';

export interface Message {
  id: string;
  sender: User;
  content: string;
  attachments: Attachment[];
  timestamp: Date;
  type: MessageType;
}

interface DiscussionConfig {
  id: string;
  title: string;
  participants: User[];
  createdAt: Date;
  projectId: string;
}

interface DiscussionData {
  config: DiscussionConfig;
  messages: Message[];
}

class Discussion {
  discussionId: string;
  private config!: DiscussionConfig;
  private messages!: Message[];

  constructor(discussionId: string) {
    this.discussionId = discussionId;
  }

  async load(): Promise<void> {
    const response = await DiscussionEndpoints.getDiscussion(this.discussionId);
    if (!response.is_successful) throw new DataFailure('load discussion', response.error ?? '');

    const data: DiscussionData = response.data! as DiscussionData;
    this.config = data.config;
    this.messages = data.messages;

    if (this.config == undefined || this.messages == undefined) throw new DataFailure('load discussion', response.error ?? 'Empty config or messages');
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public getParticipants(): User[] {
    return this.config.participants;
  }

  public getAttachments(): Attachment[] {
    return this.messages.flatMap((message) => message.attachments);
  }
}

export default Discussion;
