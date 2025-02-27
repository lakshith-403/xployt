import { CacheObject, DataFailure } from '../../cacheBase';
import { ProjectEndpoints } from './../network/project.network';

export interface Project {
    projectId: number;
    state: 'Pending' | 'Active' | 'Completed' | 'Unconfigured' | 'Rejected' | 'Closed' | 'Configured';
    clientId: string;
    leadId: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    url: string;
    technicalStack: string;
    scope: string[];
}

interface ProjectResponse {
  data: Project;
  is_successful: boolean;
  error?: string;
  trace?: string;
}

export class ProjectCache extends CacheObject<Project> {
  private projectId: string;

  constructor(projectId: string) {
    super();
    this.projectId = projectId;
  }

  async load(): Promise<Project> {
    let response: ProjectResponse;

    try {
      response = (await ProjectEndpoints.getProject(this.projectId)) as ProjectResponse;
    } catch (error) {
      console.error('Network error while fetching project:', error);
      throw new DataFailure('load project', 'Network error');
    }

    if (!response.is_successful) {
      console.error('Failed to load project:', response.error);
      throw new DataFailure('load project', response.error ?? '');
    }

    return response.data;
  }
}