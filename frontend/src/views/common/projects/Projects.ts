import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './Projects.scss';
import { Project, ProjectsCache } from '../../../data/validator/cache/projects.cache';
import { UserCache, UserCacheMock } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { ProjectTable } from './projectsTable';
import { CheckboxManager } from '../../../components/checkboxManager/checkboxManager';
import { getProjects } from '@/services/projects';
import { Project as LeadProject } from '@data/projectLead/cache/projects.cache';
import { Project as ClientProject } from '@data/client/cache/projects.cache';
import { UserType } from '@data/user';
class ProjectsView extends View {
  private params: { projectId: string };
  private projectsCache!: ProjectsCache;
  private userCache: UserCache;
  private projects: (LeadProject | ClientProject)[][] = [];
  private userId: string | null = null;
  private userType!: UserType;
  private static readonly FILTER_OPTIONS = ['pending', 'closed', 'in progress'];

  private get TABLE_HEADERS(): string[] {
    return ['ID', 'Status', 'Title', this.userType === 'Client' ? 'LeadId' : 'ClientId', 'Pending Reports'];
  }

  constructor(params: { projectId: string }) {
    super();
    this.params = params;
    this.userCache = CACHE_STORE.getUser();
    // this.projectsCache =  CACHE_STORE.getProjects();
  }

  private async loadProjects(): Promise<void> {
    try {
      const user = await this.userCache.get();
      console.log('Getting Projects');
      console.log('user', user);
      this.userId = user.id;
      console.log('user id', this.userId);
      this.projects = await getProjects(this.userId, user.type);
      this.userType = user.type;
      // if (this.projects.length === 0) {
      //   this.projects = [[], []];
      // }
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  private renderProjectSection(q: Quark, title: string, projects: (LeadProject | ClientProject)[]): void {
    const collapsible = new CollapsibleBase(title, '');
    collapsible.render(q);

    const table = new ProjectTable(projects, this.TABLE_HEADERS, {}, 'status', '');

    $(collapsible.getContent(), 'div', 'filter-bar', {}, (q) => {
      $(q, 'span', 'filter-bar-title', {}, 'Filter:');
      const checkboxManager = new CheckboxManager(ProjectsView.FILTER_OPTIONS, (checkboxValues) => {
        table.updateRows(checkboxValues);
      });
      checkboxManager.render(q);
    });
    table.render(collapsible.getContent());
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();
    await this.loadProjects();
    loading.hide();

    q.innerHTML = '';
    $(q, 'div', 'projects validator', {}, (q) => {
      const pendingProjects = this.projects[0]!;
      const completedProjects = this.projects[1]!;

      this.renderProjectSection(q, 'Pending Projects', pendingProjects);
      this.renderProjectSection(q, 'Completed Projects', completedProjects);
    });
  }
}

export const projectsViewHandler = new ViewHandler('projects', ProjectsView);
