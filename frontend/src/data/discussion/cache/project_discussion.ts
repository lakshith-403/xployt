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
}
