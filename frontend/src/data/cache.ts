import { UserCache, UserCacheMock } from './user';
import { ProjectInfoCacheMock, ProjectInfoCache } from './validator/cache/projectInfo';
import { ProjectsCacheMock, ProjectsCache } from './validator/cache/projects.cache';
import { ProjectTeamCacheMock } from './validator/cache/project.team';

class CacheStore {
  private readonly userMap: Map<string, UserCache>;
  private readonly projectInfoMap: Map<string, ProjectInfoCacheMock>;
  private readonly projectTeamsMap: Map<string, ProjectTeamCacheMock>;
  private projects: ProjectsCache;

  constructor() {
    this.userMap = new Map();
    this.projectInfoMap = new Map();
    this.projects = new ProjectsCacheMock();
    this.projectTeamsMap = new Map();
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
  public getProjectTeam(projectId: string): ProjectTeamCacheMock {
    if (!this.projectTeamsMap.has(projectId)) {
      this.projectTeamsMap.set(projectId, new ProjectTeamCacheMock());
    }

    return this.projectTeamsMap.get(projectId)!;
  }
}

export const CACHE_STORE = new CacheStore();
