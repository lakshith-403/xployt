import { UserCache, UserCacheMock } from './user';
import { ProjectInfoCacheMock, ProjectInfoCache } from './validator/cache/projectInfo';
import { ReportInfoCacheMock, ReportInfoCache } from './projectLead/cache/reportInfo';
import { ProjectsCacheMock, ProjectsCache } from './validator/cache/projects.cache';
import { ReportsCacheMock, ReportsCache } from './projectLead/cache/reports.cache';
import { ProjectTeamCacheMock } from './validator/cache/project.team';
import { HackerProjectInfoCache, HackerProjectInfoCacheMock } from './hacker/cache/hacker.projectInfo';
import { ProjectOverviewLeadCacheMock } from './projectLead/cache/projectOverview';
import { ClientCacheMock } from './projectLead/cache/client.cache';
import { NotificationsCache, NotificationsCacheMock } from '@data/hacker/cache/notifications.cache';

class CacheStore {
  private readonly userMap: Map<string, UserCache>;
  private readonly projectInfoMap: Map<string, ProjectInfoCacheMock>;
  private readonly reportInfoMap: Map<string, ReportInfoCacheMock>;
  private readonly projectTeamsMap: Map<string, ProjectTeamCacheMock>;
  private readonly hackerProjectInfoMap: Map<string, HackerProjectInfoCacheMock>;
  private readonly projectLeadOverviewMap: Map<string, ProjectOverviewLeadCacheMock>;
  private readonly clientMap: Map<string, ClientCacheMock>;
  private readonly notificationsListMap: Map<string, NotificationsCacheMock>;
  private projects: ProjectsCache;
  private reports: ReportsCache;

  constructor() {
    this.userMap = new Map();
    this.projectInfoMap = new Map();
    this.projects = new ProjectsCacheMock();
    this.projectTeamsMap = new Map();
    this.hackerProjectInfoMap = new Map();
    this.projectLeadOverviewMap = new Map();
    this.clientMap = new Map();
    this.notificationsListMap = new Map();
    // this.projects = [];
    this.reportInfoMap = new Map();
    this.reports = new ReportsCache();
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
  public getClient(clientId: string): ClientCacheMock {
    if (!this.clientMap.has(clientId)) {
      this.clientMap.set(clientId, new ClientCacheMock());
    }
    return this.clientMap.get(clientId)!;
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
  public getLeadProjectOverview(projectId: string): ProjectOverviewLeadCacheMock {
    console.log('at cache.ts getLeadProjectOverview');
    console.log('projectId', projectId);
    if (!this.projectLeadOverviewMap.has(projectId)) {
      console.log('projectId not in map, setting new ProjectOverviewLeadCacheMock');
      this.projectLeadOverviewMap.set(projectId, new ProjectOverviewLeadCacheMock());
    }
    return this.projectLeadOverviewMap.get(projectId)!;
  }

  public getNotificationsList(userId: string): NotificationsCache {
    if (!this.notificationsListMap.has(userId)) {
      this.notificationsListMap.set(userId, new NotificationsCacheMock());
    }
    return this.notificationsListMap.get(userId)!;
  }
}

export const CACHE_STORE = new CacheStore();
