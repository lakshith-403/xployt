import { DataFailure } from '../cacheBase';
import { User } from '../user';
import { MockDiscussionEndpoints as DiscussionEndpoints } from './network/discussion';

type AttachmentType = 'pdf' | 'image' | 'link' | 'report' | 'complaint';

interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  uploadedBy: User;
  uploadedAt: Date;
}

interface Message {
  id: string;
  sender: User;
  content: string;
  attachments: Attachment[];
  timestamp: Date;
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

    this.load().then();
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
}

export default Discussion;
