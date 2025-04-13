import { UserCache, UserCacheMock } from './user';
import { ProjectInfoCacheMock, ProjectInfoCache, ProjectInfo } from './validator/cache/projectInfo';
import { ReportInfoCacheMock, ReportInfoCache } from './projectLead/cache/reportInfo';
import { ProjectsCacheMock, ProjectsCache, Project } from './validator/cache/projects.cache';
import { ReportsCacheMock, ReportsCache } from './projectLead/cache/reports.cache';
import { ProjectTeamCacheMock } from './validator/cache/project.team';
// import { HackerProjectInfoCache, HackerProjectInfoCacheMock } from './hacker/cache/hacker.projects';
import { ProjectConfigInfoCache, ProjectConfigInfoCacheMock } from './projectLead/cache/projectConfigInfo';
import { ClientCacheMock } from './projectLead/cache/client.cache'; // No longer needed
import { NotificationsCache, NotificationsCacheMock } from '@data/hacker/cache/notifications.cache';
import { InvitationsCache } from '@data/common/cache/invitations.cache';
import { ProjectTeamCache} from '@data/common/cache/projectTeam.cache';
import { DiscussionCache } from './discussion/cache/discussion';

import { UserProfileCache } from './user/cache/userProfile';
import { ProjectsLeadCache, ProjectsLeadCacheMock } from './projectLead/cache/projects.cache';
import { ProjectsClientCache } from './client/cache/projects.cache';
import {ProjectCache} from "@data/common/cache/project.cache";
import {HackerInvitationsCache} from "@data/hacker/cache/hacker.invitations.cache";
import {ClientInvitationsCache} from "@data/client/cache/client.invitations.cache";
import {VulnerabilityReportCache} from "@data/common/cache/vulnerabilityReport.cache";

class CacheStore {
  private readonly user: UserCache;
  private readonly projectInfoMap: Map<string, ProjectInfoCacheMock>;
  private readonly reportInfoMap: Map<string, ReportInfoCacheMock>;
  private readonly projectTeamsMap: Map<string, ProjectTeamCache>;
  // private readonly hackerProjectInfoMap: Map<string, HackerProjectInfoCacheMock>;
  private readonly projectConfigInfoMap: Map<string, ProjectConfigInfoCache>;
  // private readonly clientMap: Map<string, ClientCache>; // No longer needed
  private readonly notificationsListMap: Map<string, NotificationsCacheMock>;
  private readonly HackerInvitationsMap: Map<string, HackerInvitationsCache>;
  private readonly ProjectInvitationsMap: Map<string, InvitationsCache>;
  private readonly InvitedHackersMap: Map<string, ClientInvitationsCache>;
  private readonly discussionMap: Map<string, DiscussionCache>;
  private projects: ProjectsCache;
  private reports: ReportsCache;
  private readonly userProfileMap: Map<string, UserProfileCache>;
  private clientProjectsMap: Map<string, ProjectsClientCache>;
  private leadProjectsMap: Map<string, ProjectsLeadCache>;
  private projectsMap: Map<string, ProjectCache>;
  private vulnerabilityReportsMap: Map<string, VulnerabilityReportCache>

  constructor() {
    this.user = new UserCache();
    this.projectInfoMap = new Map();
    this.projects = new ProjectsCache();
    this.projectTeamsMap = new Map();
    // this.hackerProjectInfoMap = new Map();
    this.projectConfigInfoMap = new Map();
    // this.clientMap = new Map();
    this.notificationsListMap = new Map();
    this.HackerInvitationsMap = new Map();
    this.ProjectInvitationsMap = new Map();
    this.InvitedHackersMap = new Map();
    // this.projects = [];
    this.reportInfoMap = new Map();
    this.reports = new ReportsCacheMock();
    this.userProfileMap = new Map();
    this.discussionMap = new Map();
    this.clientProjectsMap = new Map();
    this.leadProjectsMap = new Map();
    this.projectsMap = new Map();
    this.vulnerabilityReportsMap = new Map();
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
  // TODO: remove this
  // public getClient(userId: string): ClientCache {
  //   if (!this.clientMap.has(userId)) {
  //     this.clientMap.set(userId, new ClientCache());
  //   }
  //   return this.clientMap.get(userId)!;
  // }

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
      this.userProfileMap.set(userId, new UserProfileCache()); // Now using real cache instead of mock
    }
    return this.userProfileMap.get(userId)!;
  }

  public async updateLeadProjectConfigInfo(projectId: string, newState: 'Pending' | 'Active' | 'Completed' | 'Rejected' | 'Unconfigured' | 'Closed'): Promise<void> {
    const projectConfig = await this.getLeadProjectConfigInfo(projectId).get(false, projectId);
    projectConfig.updatestate(newState);
    await this.getLeadProjectConfigInfo(projectId).set(projectConfig);
  }

  public getNotificationsList(userId: string): NotificationsCache {
    if (!this.notificationsListMap.has(userId)) {
      this.notificationsListMap.set(userId, new NotificationsCacheMock());
    }
    return this.notificationsListMap.get(userId)!;
  }

  public getProjectInvitations(projectId: string): InvitationsCache {
    if (!this.ProjectInvitationsMap.has(projectId)) {
      this.ProjectInvitationsMap.set(projectId, new InvitationsCache(projectId));
    }
    return this.ProjectInvitationsMap.get(projectId)!;
  }

  public getInvitedHackers(projectId: string): ClientInvitationsCache {
    if(!this.InvitedHackersMap.has(projectId)){
      this.InvitedHackersMap.set(projectId, new ClientInvitationsCache(projectId))
    }
    return this.InvitedHackersMap.get(projectId)!;
  }

  public getHackerInvitations(hackerId: string): HackerInvitationsCache {
    if (!this.HackerInvitationsMap.has(hackerId)) {
      this.HackerInvitationsMap.set(hackerId, new HackerInvitationsCache(hackerId));
    }
    return this.HackerInvitationsMap.get(hackerId)!;
  }

  public getDiscussion(discussionId: string): DiscussionCache {
    if (!this.discussionMap.has(discussionId)) {
      this.discussionMap.set(discussionId, new DiscussionCache(discussionId));
    }
    return this.discussionMap.get(discussionId)!;
  }

  public getProject(projectId: string): ProjectCache {
    if (!this.projectsMap.has(projectId)) {
      this.projectsMap.set(projectId, new ProjectCache(projectId));
    }
    return this.projectsMap.get(projectId)!;
  }

    public getVulnerabilityReport(reportId: string): VulnerabilityReportCache {
        if (!this.vulnerabilityReportsMap.has(reportId)) {
        this.vulnerabilityReportsMap.set(reportId, new VulnerabilityReportCache(reportId));
        }
        return this.vulnerabilityReportsMap.get(reportId)!;
    }
}

export const CACHE_STORE = new CacheStore();
