import { User } from '../user';

type AttachmentType = 'pdf' | 'image' | 'link' | 'report' | 'complaint';

export interface Attachment {
  id: string;
  type: AttachmentType;
  url: string;
  name: string;
  uploadedBy: User;
  uploadedAt: Date;
}

export type MessageType = 'text' | 'complaint' | 'report';

export interface Message {
  id: string;
  sender: User;
  content: string;
  attachments: Attachment[];
  timestamp: string;
  type: MessageType;
  discussionId: string;
}

export interface PublicUser {
  userId: string;
  name: string;
  email: string;
}

export interface Discussion {
  id: string;
  title: string;
  participants: PublicUser[];
  createdAt: Date;
  projectId: string;
  messages: Message[];
}

export function getAttachmentsUtil(discussion: Discussion): Attachment[] {
  return discussion.messages.flatMap((message) => message.attachments);
}
