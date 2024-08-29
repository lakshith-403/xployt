import NETWORK from './../network/network';
import { CacheObject, DataFailure } from './../cacheBase';

interface ProjectResponse {
  data: [ProjectDetails[], ProjectDetails[]];
  is_successful: boolean;
  error?: string;
  trace?: string;
}

interface ProjectDetails {
  id: number;
  status: 'pending' | 'closed' | 'in progress';
  title: string;
  client: string;
  pending_reports: number;
}

export class Project {
  id: number;
  status: 'pending' | 'closed' | 'in progress';
  title: string;
  client: string;
  pendingReports: number;
  // severity: "critical" | "minor" | "informational"

  constructor(data: any) {
    this.id = data['id'];
    this.status = data['status'];
    this.title = data['title'];
    this.client = data['client'];
    this.pendingReports = data['pending_reports'];
  }
}

export class ProjectsCache extends CacheObject<Project[][]> {
  async load(validatorId: string): Promise<Project[][]> {
    const response = (await NETWORK.getAllProjects(
      validatorId
    )) as ProjectResponse;

    if (!response.is_successful)
      throw new DataFailure('load project', response.error ?? '');

    return [
      response['data'].slice(0, 1).map((projectDetails: ProjectDetails[]) => {
        return new Project({ ...projectDetails });
      }),
      response['data'].slice(1, 2).map((projectDetails: ProjectDetails[]) => {
        return new Project({ ...projectDetails });
      }),
    ];
  }
}

export class ProjectsCacheMock extends CacheObject<Project[][]> {
  async load(validatorId: string): Promise<Project[][]> {
    return [
      [
        new Project({
          id: 1,
          status: 'pending',
          title: 'Project 1',
          client: 'Client 1',
          pending_reports: 3,
        }),
        new Project({
          id: 2,
          status: 'closed',
          title: 'Project 2',
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
