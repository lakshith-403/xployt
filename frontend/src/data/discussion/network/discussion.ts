import NETWORK, { Response } from './../../network/network';

export class DiscussionEndpoints {
  static async getDiscussion(discussionId: string): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', `/api/discussion/${discussionId}`);
  }
}

export class MockDiscussionEndpoints {
  static async getDiscussion(discussionId: string): Promise<Response> {
    return {
      is_successful: true,
      data: {
        config: {
          id: 'mock-discussion-1',
          title: 'Mock Discussion',
          participants: [
            {
              id: 'user-1',
              name: 'John Doe',
              email: 'john@example.com',
            },
            {
              id: 'user-2',
              name: 'Jane Smith',
              email: 'jane@example.com',
            },
          ],
          createdAt: new Date('2024-01-01'),
          projectId: 'mock-project-1',
        },
        messages: [
          {
            id: 'msg-1',
            sender: {
              id: 'user-1',
              name: 'John Doe',
              email: 'john@example.com',
            },
            content: 'Hello everyone!',
            attachments: [
              {
                id: 'att-1',
                type: 'pdf',
                url: 'https://example.com/doc.pdf',
                name: 'Project Proposal',
                uploadedBy: {
                  id: 'user-1',
                  name: 'John Doe',
                  email: 'john@example.com',
                },
                uploadedAt: new Date('2024-01-01T10:00:00'),
              },
            ],
            timestamp: new Date('2024-01-01T10:00:00'),
          },
          {
            id: 'msg-2',
            sender: {
              id: 'user-2',
              name: 'Jane Smith',
              email: 'jane@example.com',
            },
            content: 'Hi John! Thanks for sharing the proposal.',
            attachments: [],
            timestamp: new Date('2024-01-01T10:05:00'),
          },
        ],
      },
    };
  }
}
