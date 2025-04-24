import { CacheObject, DataFailure } from '@/data/cacheBase';
import { Discussion } from '../discussion';
import { DiscussionEndpoints } from '../network/discussion';

export class ProjectDiscussionCache extends CacheObject<Discussion[]> {
  private projectId: string;

  constructor(projectId: string) {
    super();
    this.projectId = projectId;
  }

  async load(...args: any[]): Promise<Discussion[]> {
    const response = await DiscussionEndpoints.getDiscussions(this.projectId);

    if (!response.is_successful) throw new DataFailure('load discussions from project id', response.error ?? '');

    return response.data as Discussion[];
  }

  // Update a discussion in the cache without hitting the network
  updateDiscussionInCache(updatedDiscussion: Discussion): void {
    if (!this.data) return;

    const index = this.data.findIndex((discussion) => discussion.id === updatedDiscussion.id);
    if (index !== -1) {
      this.data[index] = updatedDiscussion;
    }
  }

  // Add a new discussion to the cache without hitting the network
  addDiscussionToCache(newDiscussion: Discussion): void {
    if (!this.data) {
      this.data = [newDiscussion];
      return;
    }

    // Only add if it doesn't already exist
    if (!this.data.some((discussion) => discussion.id === newDiscussion.id)) {
      this.data.push(newDiscussion);
    }
  }

  // Remove a discussion from the cache without hitting the network
  removeDiscussionFromCache(discussionId: string): void {
    if (!this.data) return;

    this.data = this.data.filter((discussion) => discussion.id !== discussionId);
  }
}
