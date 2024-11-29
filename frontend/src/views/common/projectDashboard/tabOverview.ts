import { Quark } from '@ui_lib/quark';
// import { Project } from '@data/validator/cache/projects.cache';
import { User, UserCache } from '@data/user';
import { UserType } from '@data/user';
import { CACHE_STORE } from '@data/cache';
// import { ProjectsCache } from '@data/validator/cache/projects.cache';
import Lead from './tabOverviewContent/lead';
import Client from './tabOverviewContent/client';
import Hacker from './tabOverviewContent/hacker';
import './tabOverview.scss';

export default class Overview {
  // private project!: Project;
  private user!: User;
  // private projectsCache: ProjectsCache;
  private userCache: UserCache;
  private role!: UserType;
  // private role: string = 'guest';

  constructor(private projectId: string) {
    // this.project = new Project(projectId);
    this.userCache = CACHE_STORE.getUser();
    // this.projectsCache = CACHE_STORE.getProjects();
  }

  private async loadData(): Promise<void> {
    try {
      this.user = await this.userCache.get();
      // console.log(this.user);
      this.role = this.user.type;
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();
    switch (this.role) {
      case 'ProjectLead':
        const lead = new Lead(this.projectId);
        lead.render(q);
        break;

      case 'Client':
        const client = new Client(this.projectId);
        client.render(q);
        break;
      case 'Hacker':
        const hacker = new Hacker(this.projectId);
        hacker.render(q);
        break;
    }
  }
}
