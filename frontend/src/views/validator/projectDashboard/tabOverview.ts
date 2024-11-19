import { Quark } from '../../../ui_lib/quark';
import { Project } from '../../../data/validator/cache/projects.cache';
import { User, UserCache } from '@/data/user';
import { CACHE_STORE } from '@/data/cache';
import { ProjectsCache } from '@/data/validator/cache/projects.cache';
import Lead from './tabOverviewContent/lead';
import Client from './tabOverviewContent/client';
import Hacker from './tabOverviewContent/hacker';
import './tabOverview.scss';

export default class Overview {
  private project!: Project;
  private user!: User;
  private projectsCache: ProjectsCache;
  private userCache: UserCache;
  private role: string = 'guest';

  constructor(private projectId: string) {
    // this.project = new Project(projectId);
    this.userCache = CACHE_STORE.getUser('1');
    this.projectsCache = CACHE_STORE.getProjects();
  }

  private async loadData(): Promise<void> {
    try {
      this.user = await this.userCache.get();
      console.log(this.user);
      this.role = this.user.role;
      console.log(this.role);
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();
    console.log(this.role);
    switch (this.role) {
      case 'project_lead':
        const lead = new Lead(this.projectId);
        lead.render(q);
        break;

      case 'guest':
        const client = new Client();
        client.render(q);
        break;
      case 'hacker':
        const hacker = new Hacker(this.projectId);
        hacker.render(q);
        break;
    }
  }
}
