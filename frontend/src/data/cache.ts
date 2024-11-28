import { UserCache, UserCacheMock } from './user';
import { ProjectInfoCacheMock, ProjectInfoCache } from './validator/cache/projectInfo';
import { ReportInfoCacheMock, ReportInfoCache } from './projectLead/cache/reportInfo';
import { ProjectsCacheMock, ProjectsCache } from './validator/cache/projects.cache';
import { ReportsCacheMock, ReportsCache } from './projectLead/cache/reports.cache';
import { ProjectTeamCacheMock } from './validator/cache/project.team';
import { HackerProjectInfoCache, HackerProjectInfoCacheMock } from './hacker/cache/hacker.projectInfo';
import { ProjectConfigInfoCache, ProjectConfigInfoCacheMock } from './projectLead/cache/projectConfigInfo';
import { ClientCacheMock } from './projectLead/cache/client.cache';
import { NotificationsCache, NotificationsCacheMock } from '@data/hacker/cache/notifications.cache';
import {InvitationsCache} from '@data/common/cache/invitations.cache'
import {ProjectTeamCache} from "@data/common/cache/projectTeam.cache";
import { DiscussionCache } from './discussion/cache/discussion';
import { UserProfileCache, UserProfileCacheMock } from './user/cache/userProfile';

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
  private readonly userProfileMap: Map<string, UserProfileCache>;

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
    this.userProfileMap = new Map();
    this.discussionMap = new Map();
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

  // Update the method in CacheStore class
  public getUserProfile(userId: string): UserProfileCache {
    if (!this.userProfileMap.has(userId)) {
      this.userProfileMap.set(userId, new UserProfileCacheMock()); // Now using real cache instead of mock
    }
    return this.userProfileMap.get(userId)!;
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