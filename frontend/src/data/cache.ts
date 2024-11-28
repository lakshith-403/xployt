import { UserCache, UserCacheMock } from './user';
import { ProjectInfoCacheMock, ProjectInfoCache, ProjectInfo } from './validator/cache/projectInfo';
import { ReportInfoCacheMock, ReportInfoCache } from './projectLead/cache/reportInfo';
import { ProjectsCacheMock, ProjectsCache, Project } from './validator/cache/projects.cache';
import { ReportsCacheMock, ReportsCache } from './projectLead/cache/reports.cache';
import { ProjectTeamCacheMock } from './validator/cache/project.team';
import { HackerProjectInfoCache, HackerProjectInfoCacheMock } from './hacker/cache/hacker.projectInfo';
import { ProjectConfigInfoCache, ProjectConfigInfoCacheMock } from './projectLead/cache/projectConfigInfo';
import { ClientCacheMock } from './projectLead/cache/client.cache';
import { NotificationsCache, NotificationsCacheMock } from '@data/hacker/cache/notifications.cache';
import { InvitationsCache } from '@data/common/cache/invitations.cache';
import { ProjectTeamCache } from '@data/common/cache/projectTeam.cache';
import { DiscussionCache } from './discussion/cache/discussion';
import { ProjectsLeadCache, ProjectsLeadCacheMock } from './projectLead/cache/projects.cache';
import { ProjectsClientCache } from './client/cache/projects.cache';
class CacheStore {
  private readonly user: UserCache;
  private readonly projectInfoMap: Map<string, ProjectInfoCacheMock>;
  private readonly reportInfoMap: Map<string, ReportInfoCacheMock>;
  private readonly projectTeamsMap: Map<string, ProjectTeamCache>;
  private readonly hackerProjectInfoMap: Map<string, HackerProjectInfoCacheMock>;
  private readonly projectConfigInfoMap: Map<string, ProjectConfigInfoCache>;
  private readonly clientMap: Map<string, ClientCacheMock>;
  private readonly notificationsListMap: Map<string, NotificationsCacheMock>;
  private readonly invitationsMap: Map<string, InvitationsCache>;
  private readonly discussionMap: Map<string, DiscussionCache>;
  private projects: ProjectsCache;
  private reports: ReportsCache;
  private clientProjectsMap: Map<string, ProjectsClientCache>;
  private leadProjectsMap: Map<string, ProjectsLeadCache>;

  constructor() {
    this.user = new UserCache();
    this.projectInfoMap = new Map();
    this.projects = new ProjectsCache();
    this.projectTeamsMap = new Map();
    this.hackerProjectInfoMap = new Map();
    this.projectConfigInfoMap = new Map();
    this.clientMap = new Map();
    this.notificationsListMap = new Map();
    this.invitationsMap = new Map();
    // this.projects = [];
    this.reportInfoMap = new Map();
    this.reports = new ReportsCacheMock();
    this.discussionMap = new Map();
    this.clientProjectsMap = new Map();
    this.leadProjectsMap = new Map();
  }

  public getClientProjects(clientId: string): ProjectsClientCache {
    console.log('Getting client projects for clientId:', clientId);
    if (!this.clientProjectsMap.has(clientId)) {
      console.log('clientId not in map, setting new ProjectsClientCache');
      this.clientProjectsMap.set(clientId, new ProjectsClientCache());
    }
    return this.clientProjectsMap.get(clientId)!;
  }
  public getLeadProjects(leadId: string): ProjectsLeadCache {
    console.log('Getting lead projects for leadId:', leadId);
    if (!this.leadProjectsMap.has(leadId)) {
      console.log('leadId not in map, setting new ProjectsLeadCache');
      this.leadProjectsMap.set(leadId, new ProjectsLeadCache());
    }
    return this.leadProjectsMap.get(leadId)!;
  }
  public getUser(): UserCache {
    return this.user;
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

  public getReportInfo(reportId: string): ReportInfoCache {
    if (!this.reportInfoMap.has(reportId)) {
      this.reportInfoMap.set(reportId, new ReportInfoCacheMock());
    }

    return this.reportInfoMap.get(reportId)!;
  }
  public getReports(): ReportsCache {
    return this.reports;
  }

  public getProjectTeam(projectId: string): ProjectTeamCache {
    if (!this.projectTeamsMap.has(projectId)) {
      this.projectTeamsMap.set(projectId, new ProjectTeamCache());
    }
    return this.projectTeamsMap.get(projectId)!;
  }
  public getHackerProjectInfo(projectId: string): HackerProjectInfoCache {
    if (!this.hackerProjectInfoMap.has(projectId)) {
      this.hackerProjectInfoMap.set(projectId, new HackerProjectInfoCacheMock());
    }

    return this.hackerProjectInfoMap.get(projectId)!;
  }
  public getLeadProjectConfigInfo(projectId: string): ProjectConfigInfoCache {
    console.log('at cache.ts getLeadProjectConfigInfo');
    console.log('projectId', projectId);
    if (!this.projectConfigInfoMap.has(projectId)) {
      console.log('projectId not in map, setting new ProjectConfigInfoCache');
      this.projectConfigInfoMap.set(projectId, new ProjectConfigInfoCache());
    }
    return this.projectConfigInfoMap.get(projectId)!;
  }
  public async updateLeadProjectConfigInfo(projectId: string, newStatus: 'Pending' | 'Active' | 'Completed' | 'Rejected' | 'Unconfigured' | 'Closed'): Promise<void> {
    const projectConfig = await this.getLeadProjectConfigInfo(projectId).get(false, projectId);
    projectConfig.updateStatus(newStatus);
    await this.getLeadProjectConfigInfo(projectId).set(projectConfig);
  }
  public getNotificationsList(userId: string): NotificationsCache {
    if (!this.notificationsListMap.has(userId)) {
      this.notificationsListMap.set(userId, new NotificationsCacheMock());
    }
    return this.notificationsListMap.get(userId)!;
  }

  public getProjectInvitations(projectId: string): InvitationsCache {
    if (!this.invitationsMap.has(projectId)) {
      this.invitationsMap.set(projectId, new InvitationsCache());
    }
    return this.invitationsMap.get(projectId)!;
  }

  public getHackerInvitations(hackerId: string): InvitationsCache {
    if (!this.invitationsMap.has(hackerId)) {
      this.invitationsMap.set(hackerId, new InvitationsCache());
    }
    return this.invitationsMap.get(hackerId)!;
  }

  public getDiscussion(discussionId: string): DiscussionCache {
    if (!this.discussionMap.has(discussionId)) {
      this.discussionMap.set(discussionId, new DiscussionCache(discussionId));
    }
    return this.discussionMap.get(discussionId)!;
  }
}

export const CACHE_STORE = new CacheStore();
