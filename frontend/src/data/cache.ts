import { UserCache, UserCacheMock } from './user';
import { ProjectInfoCacheMock, ProjectInfoCache } from './validator/cache/projectInfo';
import { ProjectsCacheMock, ProjectsCache } from './validator/cache/projects.cache';

class CacheStore {
  private readonly userMap: Map<string, UserCache>;
  private readonly projectInfoMap: Map<string, ProjectInfoCacheMock>;
  private projects: ProjectsCache;

  constructor() {
    this.userMap = new Map();
    this.projectInfoMap = new Map();
    this.projects = new ProjectsCacheMock();
    // this.projects = [];
  }

  public getUser(username: string): UserCache {
    if (!this.userMap.has(username)) {
      this.userMap.set(username, new UserCacheMock());
    }

    return this.userMap.get(username)!;
  }
  public getProjectInfo(projectId: string): ProjectInfoCache {
    if (!this.projectInfoMap.has(projectId)) {
      this.projectInfoMap.set(projectId, new ProjectInfoCacheMock());
    }

    return this.projectInfoMap.get(projectId)!;
  }
  public getProjects(): ProjectsCache {
    return this.projects;
  }
}

export const CACHE_STORE = new CacheStore();
