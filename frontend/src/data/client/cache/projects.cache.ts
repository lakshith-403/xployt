import { CacheObject, DataFailure } from '../../cacheBase';
import { projectEndpoints } from './../network/project.network';

interface ProjectResponse {
  data: [ProjectDetails[], ProjectDetails[]];
  is_successful: boolean;
  error?: string;
  trace?: string;
}

interface ProjectDetails {
  id: number;
  status: 'Pending' | 'Closed' | 'In progress' | 'Unconfigured' | 'Cancelled' | 'Active';
  title: string;
  leadId: string;
  pendingReports: number;
}

export class Project {
  id: number;
  status: 'Pending' | 'Closed' | 'In progress' | 'Unconfigured' | 'Cancelled' | 'Active';
  title: string;
  leadId: string;
  pendingReports: number;
  // severity: "critical" | "minor" | "informational"

  constructor(data: ProjectDetails) {
    this.id = data['id'];
    this.status = data['status'];
    this.title = data['title'];
    this.leadId = data['leadId'];
    this.pendingReports = data['pendingReports'];
  }
}

export class ProjectsClientCache extends CacheObject<Project[][]> {
  async load(userId: string): Promise<Project[][]> {
    console.log(`Loading projects for user: ${userId}`);
    let response: ProjectResponse;

    try {
      response = (await projectEndpoints.getAllProjects(userId.toString())) as ProjectResponse;
    } catch (error) {
      console.error('Network error while fetching projects:', error);
      throw new DataFailure('load project', 'Network error');
    }

    if (!response.is_successful) {
      console.error('Failed to load projects:', response.error);
      throw new DataFailure('load project', response.error ?? '');
    }

    console.log('Projects loaded successfully:', response.data);

    return [
      response['data'][0].map((projectDetails: ProjectDetails) => {
        return new Project({ ...projectDetails });
      }),
      response['data'][1].map((projectDetails: ProjectDetails) => {
        return new Project({ ...projectDetails });
      }),
    ];
  }
}

export class ProjectsClientCacheMock extends CacheObject<Project[][]> {
  async load(userId: string): Promise<Project[][]> {
    return [
      [
        new Project({
          id: 1,
          status: 'Unconfigured',
          title: 'Project GT-175',
          leadId: 'Lead 1',
          pendingReports: 3,
        }),
        new Project({
          id: 2,
          status: 'Pending',
          title: 'Project WV-102',
          leadId: 'Lead 2',
          pendingReports: 0,
        }),
      ],
      [
        new Project({
          id: 3,
          status: 'In progress',
          title: 'Project 3',
          leadId: 'Lead 3',
          pendingReports: 1,
        }),
      ],
    ];
  }
}
