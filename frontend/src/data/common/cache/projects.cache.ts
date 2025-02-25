import {CacheObject, DataFailure} from '../../cacheBase';
import {ProjectEndpoints} from '../../common/network/project.network';

export interface ProjectList{
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

export class UserProjectsCache extends CacheObject<ProjectList> {

  async load(...args: any[]): Promise<ProjectList> {
    const [userId, userStatus] = args;
    console.log(`Loading projects for ${userStatus}: ${userId}`);
    let response: ProjectResponse;

    try {
      response = (await ProjectEndpoints.getAllProjects(userId, userStatus)) as ProjectResponse;
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
}