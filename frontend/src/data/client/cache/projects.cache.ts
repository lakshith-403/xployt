import {CacheObject, DataFailure} from '../../cacheBase';
import {projectEndpoints} from '../../client/network/project.network';
import {Project} from "@data/common/cache/project.cache";

interface ProjectList{
    activeProjects: ProjectBrief[];
    requestedProjects: ProjectBrief[];
    inactiveProjects: ProjectBrief[];
}

interface ProjectResponse {
  data: ProjectList;
  is_successful: boolean;
  error?: string;
  trace?: string;
}

interface ProjectDetails {
  id: number;
  state: 'Pending' | 'Closed' | 'In progress' | 'Unconfigured' | 'Cancelled' | 'Active' | 'Rejected';
  title: string;
  leadId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  pendingReports: number;
}

export class ProjectBrief {
  id: number;
  state: 'Pending' | 'Closed' | 'In progress' | 'Unconfigured' | 'Cancelled' | 'Active' | 'Rejected';
  title: string;
  leadId: string;
  clientId: string;
  startDate: string;
  endDate: string;
  pendingReports: number;
  // severity: "critical" | "minor" | "informational"

  constructor(data: ProjectDetails) {
    this.id = data['id'];
    this.state = data['state'];
    this.title = data['title'];
    this.leadId = data['leadId'];
    this.clientId = data['clientId'];
    this.startDate = data['startDate'];
    this.endDate = data['endDate'];
    this.pendingReports = data['pendingReports'];
  }
}

export class ProjectsClientCache extends CacheObject<ProjectList> {

  async load(userId: string): Promise<ProjectList> {
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

    return {
      activeProjects:
          response.data.activeProjects.length > 0
              ? response.data.activeProjects.map(project => new ProjectBrief(project))
              : [],
      requestedProjects: response.data.requestedProjects.length > 0
          ? response.data.requestedProjects.map(project => new ProjectBrief(project))
          : [],
      inactiveProjects: response.data.inactiveProjects.length > 0
          ? response.data.inactiveProjects.map(project => new ProjectBrief(project))
          : [],
    };
  }

  async closeProject(projectId: string): Promise<Project> {
    console.log('Closing project:', projectId);
    const response = await projectEndpoints.closeProject(projectId);

    if (!response.is_successful) {
      console.error('Failed to close project:', response.error);
      throw new DataFailure('close project', response.error ?? '');
    }

    return response.data as Project;
  }

//   public updateProject(projectId: number, state: 'Pending' | 'Closed' | 'In progress' | 'Unconfigured' | 'Rejected' | 'Active'): void {
//     console.log('Updating project:', projectId, state);
//     console.log('Current projects:', this.data![0]);
//     this.data![0] = this.data![0].map((p) => (p.id === projectId ? { ...p, state } : p));
//     console.log('Updated project:', this.data![0]);
//   }
}

// export class ProjectsClientCacheMock extends CacheObject<Project[][]> {
//   async load(userId: string): Promise<Project[][]> {
//     return [
//       [
//         new Project({
//           id: 1,
//           state: 'Unconfigured',
//           title: 'Project GT-175',
//           leadId: 'Lead 1',
//
//           pendingReports: 3,
//         }),
//         new Project({
//           id: 2,
//           state: 'Pending',
//           title: 'Project WV-102',
//           leadId: 'Lead 2',
//           pendingReports: 0,
//         }),
//       ],
//       [
//         new Project({
//           id: 3,
//           state: 'In progress',
//           title: 'Project 3',
//           leadId: 'Lead 3',
//           pendingReports: 1,
//         }),
//       ],
//     ];
//   }
// }
