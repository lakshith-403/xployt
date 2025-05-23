import { CacheObject, DataFailure } from '../../cacheBase';
import { Discussion, Message } from '../discussion';
import { DiscussionEndpoints } from '../network/discussion';

export class DiscussionCache extends CacheObject<Discussion> {
  private discussionId: string;

  constructor(discussionId: string) {
    super();
    this.discussionId = discussionId;
  }

  async load(): Promise<Discussion> {
    const response = await DiscussionEndpoints.getDiscussion(this.discussionId);

    if (!response.is_successful) throw new DataFailure('load discussion', response.error ?? '');

    return response.data as Discussion;
  }

  async update(arg: Discussion): Promise<Discussion> {
    const response = await DiscussionEndpoints.updateDiscussion(arg);

    if (!response.is_successful) throw new DataFailure('update discussion', response.error ?? '');

    this.data = response.data as Discussion;

    return response.data as Discussion;
  }

  async sendMessage(arg: Message, attachments: File[]): Promise<Message> {
    const response = await DiscussionEndpoints.sendMessage(arg, attachments);

    if (!response.is_successful) throw new DataFailure('send message', response.error ?? '');

    if (this.data == null) {
      await this.load();
    }

    this.data!.messages.push(response.data as Message);

    return response.data as Message;
  }

  async create(arg: Discussion): Promise<Discussion> {
    const response = await DiscussionEndpoints.createDiscussion(arg);

    if (!response.is_successful) throw new DataFailure('create discussion', response.error ?? '');

    return response.data as Discussion;
  }

  async saveMessage(arg: Message): Promise<Message> {
    const response = await DiscussionEndpoints.saveMessage(arg);

    if (!response.is_successful) throw new DataFailure('save message', response.error ?? '');

    this.data!.messages = this.data!.messages.map((m) => (m.id === arg.id ? arg : m));

    return response.data as Message;
  }

  async deleteMessage(arg: Message): Promise<Message> {
    const response = await DiscussionEndpoints.deleteMessage(arg);

    if (!response.is_successful) throw new DataFailure('delete message', response.error ?? '');

    this.data!.messages = this.data!.messages.filter((m) => m.id !== arg.id);

    return response.data as Message;
  }

  async deleteDiscussion(): Promise<void> {
    const response = await DiscussionEndpoints.deleteDiscussion(this.discussionId);

    if (!response.is_successful) throw new DataFailure('delete discussion', response.error ?? '');

    this.data = undefined;
  }
}
