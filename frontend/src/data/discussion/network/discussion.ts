import NETWORK, { Response } from './../../network/network';

export class DiscussionEndpoints {
  private static readonly BASE_URL = '/api/discussions';

  static async getDiscussions(projectId: string): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', `/api/project_discussions/${projectId}`);
  }

  static async getDiscussion(discussionId: string): Promise<Response> {
    return NETWORK.sendHttpRequest('GET', `${this.BASE_URL}/${discussionId}`);
  }

  static async createDiscussion(discussion: any): Promise<Response> {
    return NETWORK.sendHttpRequest('POST', `${this.BASE_URL}`, discussion);
  }

  static async updateDiscussion(discussion: any): Promise<Response> {
    return NETWORK.sendHttpRequest('PUT', `${this.BASE_URL}/${discussion.discussionId}`, discussion);
  }

  static async sendMessage(message: any, attachments: File[]): Promise<Response> {
    const formData = new FormData();
    formData.append('message', JSON.stringify(message));
    attachments.forEach((attachment: any) => {
      formData.append('files', attachment);
    });

    console.log(formData);

    return NETWORK.sendHttpRequest('POST', `/api/messages/`, formData, 'multipart/form-data');
  }

  static async saveMessage(message: any): Promise<Response> {
    return NETWORK.sendHttpRequest('PUT', `/api/messages/${message.id}`, message);
  }

  static async deleteMessage(message: any): Promise<Response> {
    return NETWORK.sendHttpRequest('DELETE', `/api/messages/${message.id}`);
  }

  static async deleteDiscussion(discussionId: string): Promise<Response> {
    return NETWORK.sendHttpRequest('DELETE', `${this.BASE_URL}/${discussionId}`);
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
              id: 1,
              username: 'johndoe',
              name: 'John Doe',
              email: 'john@example.com',
              type: 'Client',
              avatar: 'https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg',
            },
            {
              id: 2,
              username: 'janesmith',
              name: 'Jane Smith',
              email: 'jane@example.com',
              type: 'Client',
              avatar: 'https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg',
            },
          ],
          createdAt: new Date('2024-01-01'),
          projectId: 'mock-project-1',
          type: 'user',
        },
        messages: [
          {
            id: 'msg-1',
            sender: {
              id: 1,
              username: 'johndoe',
              name: 'John Doe',
              email: 'john@example.com',
              type: 'Client',
              avatar: 'https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg',
            },
            content: "Hello everyone! Here's the project proposal",
            attachments: [
              {
                id: 'att-1',
                type: 'pdf',
                url: 'https://example.com/doc.pdf',
                name: 'Project Proposal',
                uploadedBy: {
                  id: 2,
                  username: 'janesmith',
                  name: 'Jane Smith',
                  email: 'jane@example.com',
                  type: 'Client',
                  avatar: 'https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg',
                },
                uploadedAt: new Date('2024-01-01T10:00:00'),
              },
            ],
            timestamp: new Date('2024-01-01T10:00:00'),
            type: 'user',
          },
          {
            id: 'msg-2',
            sender: {
              id: 1,
              username: 'johndoe',
              name: 'John Doe',
              email: 'john@example.com',
              type: 'Client',
              avatar: 'https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg',
            },
            content: 'Hi John! Thanks for sharing the proposal.',
            attachments: [],
            timestamp: new Date('2024-01-01T10:05:00'),
            type: 'user',
          },
          {
            id: 'msg-3',
            sender: {
              id: 2,
              username: 'janesmith',
              name: 'Jane Smith',
              email: 'jane@example.com',
              type: 'Client',
              avatar: 'https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg',
            },
            content: 'I have some questions about the proposal.',
            attachments: [],
            timestamp: new Date('2024-01-01T10:10:00'),
            type: 'user',
          },
          {
            id: 'msg-4',
            sender: {
              id: 0,
              username: 'admin',
              name: 'Admin',
              email: 'admin@example.com',
              type: 'Admin',
              avatar: 'https://fastly.picsum.photos/id/64/4326/2884.jpg?hmac=9_SzX666YRpR_fOyYStXpfSiJ_edO3ghlSRnH2w09Kg',
            },
            content: 'Jane Smith Filed a Complaint',
            attachments: [
              {
                id: 'att-2',
                type: 'pdf',
                url: 'https://example.com/doc.pdf',
                name: 'Complaint',
              },
            ],
            timestamp: new Date('2024-01-01T10:10:00'),
            type: 'complaint',
          },
        ],
      },
    };
  }
}
