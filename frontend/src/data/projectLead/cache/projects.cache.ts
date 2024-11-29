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
  status: 'Pending' | 'Closed' | 'In progress' | 'Unconfigured' | 'Rejected' | 'Active';
  title: string;
  clientId: string;
  pendingReports: number;
}

export class Project {
  id: number;
  status: 'Pending' | 'Closed' | 'In progress' | 'Unconfigured' | 'Rejected' | 'Active';
  title: string;
  client: string;
  pendingReports: number;
  // severity: "critical" | "minor" | "informational"

  constructor(data: any) {
    this.id = data['id'];
    this.status = data['status'];
    this.title = data['title'];
    this.client = data['clientId'];
    this.pendingReports = data['pendingReports'];
  }
}

export class ProjectsLeadCache extends CacheObject<Project[][]> {
  async load(userId: string): Promise<Project[][]> {
    console.log(`Loading projects for user: ${userId}`);
    let response: ProjectResponse;

    try {
      response = (await projectEndpoints.getAllProjects(userId)) as ProjectResponse;
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
  public updateProject(projectId: number, status: 'Pending' | 'Closed' | 'In progress' | 'Unconfigured' | 'Rejected' | 'Active'): void {
    console.log('Updating project:', projectId, status);
    console.log('Current projects:', this.data![0]);
    this.data![0] = this.data![0].map((p) => (p.id === projectId ? { ...p, status } : p));
    console.log('Updated project:', this.data![0]);
  }
}

export class ProjectsLeadCacheMock extends CacheObject<Project[][]> {
  async load(userId: number): Promise<Project[][]> {
    return [
      [
        new Project({
          id: 1,
          status: 'unconfigured',
          title: 'Project GT-175',
          client: 'Client 1',
          pending_reports: 3,
        }),
        new Project({
          id: 2,
          status: 'pending',
          title: 'Project WV-102',
          client: 'Client 2',
          pending_reports: 0,
        }),
      ],
      [
        new Project({
          id: 3,
          status: 'in progress',
          title: 'Project 3',
          client: 'Client 3',
          pending_reports: 1,
        }),
      ],
    ];
  }
}
