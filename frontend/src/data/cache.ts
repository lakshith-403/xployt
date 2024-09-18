import { UserCache, UserCacheMock } from './user';
import { ProjectInfoCacheMock, ProjectInfoCache } from './validator/cache/projectInfo';
import { ReportInfoCacheMock, ReportInfoCache } from './projectLead/cache/reportInfo';
import { ProjectsCacheMock, ProjectsCache } from './validator/cache/projects.cache';
import { ReportsCacheMock, ReportsCache } from './projectLead/cache/reports.cache';
import { ProjectTeamCacheMock } from './validator/cache/project.team';
import { HackerProjectInfoCache, HackerProjectInfoCacheMock } from './hacker/cache/hacker.projectInfo';
import { InvitationsCacheMock } from './User/cache/invitations.cache';

class CacheStore {
    
  private readonly userMap: Map<string, UserCache>;
  private readonly projectInfoMap: Map<string, ProjectInfoCacheMock>;
  private readonly reportInfoMap: Map<string, ReportInfoCacheMock>;
  private readonly projectTeamsMap: Map<string, ProjectTeamCacheMock>;
  private readonly hackerProjectInfoMap: Map<string, HackerProjectInfoCacheMock>;
  private readonly invitationsMap: Map<string, InvitationsCacheMock>;
  private projects: ProjectsCache;
  private reports: ReportsCache;

  constructor() {
    this.userMap = new Map();
    this.projectInfoMap = new Map();
    this.projects = new ProjectsCacheMock();
    this.projectTeamsMap = new Map();
    this.hackerProjectInfoMap = new Map();
    // this.projects = [];
    this.reportInfoMap = new Map();
    this.reports = new ReportsCacheMock(); 
    this.invitationsMap = new Map();
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

  public getProjectTeam(projectId: string): ProjectTeamCacheMock {
    if (!this.projectTeamsMap.has(projectId)) {
      this.projectTeamsMap.set(projectId, new ProjectTeamCacheMock());
    }
    return this.projectTeamsMap.get(projectId)!;
  }
  public getHackerProjectInfo(projectId: string): HackerProjectInfoCache {
    if (!this.hackerProjectInfoMap.has(projectId)) {
      this.hackerProjectInfoMap.set(projectId, new HackerProjectInfoCacheMock());
    }

    return this.hackerProjectInfoMap.get(projectId)!;
  }


  public getInvitations(userId: string): InvitationsCacheMock {
    if (!this.invitationsMap.has(userId)) {
      this.invitationsMap.set(userId, new InvitationsCacheMock());
    }
    return this.invitationsMap.get(userId)!;
  }


} 

export const CACHE_STORE = new CacheStore();
