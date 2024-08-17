import NETWORK from "./network"
import {CacheObject, DataFailure} from "./cache"

interface ProjectResponse {
  data: { [key: string]: ProjectDetails };
  is_successful: boolean;
  error?: string
  trace?: string
}

interface ProjectDetails {
  id: number;
  status: "pending" | "closed" | "in progress";
  title: string;
  client: string;
  pending_reports: number;
}

export class Project {
  id: number
  status: "pending" | "closed" | "in progress"
  title: string
  client: string
  pendingReports: number
  // severity: "critical" | "minor" | "informational"

  constructor(data: any) {
    this.id = data['id']
    this.status = data['status']
    this.title = data['title']
    this.client = data['client']
    this.pendingReports = data['pending_reports']
  }
}

export class ProjectsCache extends CacheObject<Project[]> {
  async load(): Promise<Project[]> {
    const response = await NETWORK.getAllProjects()  as ProjectResponse;

    if (!response.is_successful)
      throw new DataFailure("load project", response.error ?? "")

    return Object.keys(response['data']).map((id: string) => {
      const projectDetails = response['data'][id];
      return new Project({ id: parseInt(id), ...projectDetails });
    });
  }
}

export class ProjectsCacheMock extends CacheObject<Project[]> {
  async load(): Promise<Project[]> {
    return [
      new Project({
        id: 1,
        status: "pending",
        title: "Project 1",
        client: "Client 1",
        pending_reports: 3
      }),
      new Project({
        id: 2,
        status: "closed",
        title: "Project 2",
        client: "Client 2",
        pending_reports: 0
      }),
      new Project({
        id: 3,
        status: "in progress",
        title: "Project 3",
        client: "Client 3",
        pending_reports: 1
      })
    ];
  }
}