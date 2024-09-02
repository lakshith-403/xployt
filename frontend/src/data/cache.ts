import { UserCache, UserCacheMock } from './user';
import { ProjectInfoCacheMock, ProjectInfoCache } from './validator/cache/projectInfo';
import { ReportInfoCacheMock, ReportInfoCache } from './validator/cache/reportInfo';
import { ProjectsCacheMock, ProjectsCache } from './validator/cache/projects.cache';
import { ReportsCacheMock, ReportsCache } from './validator/cache/reports.cache';

class CacheStore {
  private readonly userMap: Map<string, UserCache>;
  private readonly projectInfoMap: Map<string, ProjectInfoCacheMock>;
  private readonly reportInfoMap: Map<string, ReportInfoCacheMock>;
  private projects: ProjectsCache;
  private reports: ReportsCache;

  constructor() {
    this.userMap = new Map();
    this.projectInfoMap = new Map();
    this.projects = new ProjectsCacheMock();
    // this.projects = [];
    this.reportInfoMap = new Map();
    this.reports = new ReportsCacheMock(); 
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
  // Reports part 

    public getReportInfo(reportId: string): ReportInfoCache {
      if (!this.reportInfoMap.has(reportId)) {
        this.reportInfoMap.set(reportId, new ReportInfoCacheMock());
      }

      return this.reportInfoMap.get(reportId)!;
    }
    public getReports(): ReportsCache {
      return this.reports;
    }

}

export const CACHE_STORE = new CacheStore();
