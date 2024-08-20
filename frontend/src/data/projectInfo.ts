import NETWORK from "./network"
import {CacheObject, DataFailure} from "./cacheBase"

export class ProjectInfo {
  id: number;
  title: string;
  client: string;
  startDate: string;
  endDate: string;
  description: string;
  scope: string;

  constructor(data: any) {
    this.id = data['id']
    this.title = data['title']
    this.client = data['client']
    this.startDate = data['startDate']
    this.endDate = data['endDate']
    this.description = data['description']
    this.scope = data['scope']
  }
}

export class ProjectInfoCache extends CacheObject<ProjectInfo> {
  async load(): Promise<ProjectInfo> {
    const response = await NETWORK.getAllProjects();

    if (!response.is_successful)
      throw new DataFailure("load project", response.error ?? "")

    return new ProjectInfo(response.data)
  }
}

export class ProjectInfoCacheMock extends CacheObject<ProjectInfo> {
  async load(): Promise<ProjectInfo> {
    console.log("Mocking project data");
    return new ProjectInfo({    
      id: 1,
      title: "Project 1",
      client: "Client 1",
      startDate: "2021-01-01",
      endDate: "2021-12-31",
      description: "Description of project 1",
      scope: "Scope of project 1"
    });
  }
}