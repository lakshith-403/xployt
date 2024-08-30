import { UserCache } from './user';
import {
  ProjectInfoCacheMock,
  ProjectInfoCache,
} from './validator/cache/projectInfo';
import { ProjectsCacheMock, ProjectsCache } from './validator/cache/projects';

class CacheStore {
  private readonly userMap: Map<string, UserCache>;
  private readonly projectInfoMap: Map<string, ProjectInfoCacheMock>;
  private readonly projectsMap: Map<string, ProjectsCache>;

  constructor() {
    this.userMap = new Map();
    this.projectInfoMap = new Map();
    this.projectsMap = new Map();
  }

  public getUser(username: string): UserCache {
    if (!this.userMap.has(username)) {
      this.userMap.set(username, new UserCache());
    }

    return this.userMap.get(username)!;
  }
  public getProjectInfo(projectId: string): ProjectInfoCache {
    if (!this.projectInfoMap.has(projectId)) {
      this.projectInfoMap.set(projectId, new ProjectInfoCacheMock());
    }

    return this.projectInfoMap.get(projectId)!;
  }
}

export const CACHE_STORE = new CacheStore();
