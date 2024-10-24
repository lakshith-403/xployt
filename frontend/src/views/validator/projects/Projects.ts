import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './Projects.scss';
import { Project, ProjectsCache } from '../../../data/validator/cache/projects.cache';
import { UserCache } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { ProjectTable } from './projectsTable';
import { CheckboxManager } from '../../../components/checkboxManager/checkboxManager';

class ProjectsView extends View {
  private params: { projectId: string };
  private projectsCache: ProjectsCache;
  private userCache: UserCache;
  private projects: Project[][] = [];
  private userId: number | null = null;

  private static readonly TABLE_HEADERS = ['ID', 'Status', 'Title', 'Client', 'Pending Reports'];
  private static readonly FILTER_OPTIONS = ['pending', 'closed', 'in progress'];

  constructor(params: { projectId: string }) {
    super();
    this.params = params;
    this.userCache = CACHE_STORE.getUser('123');
    this.projectsCache = CACHE_STORE.getProjects();
  }

  private async loadProjects(): Promise<void> {
    try {
      const user = await this.userCache.get();
      this.userId = user.id;
      this.projects = await this.projectsCache.get(false, 123);
      if (this.projects.length === 0) {
        this.projects = [[], []];
      }
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  private renderProjectSection(q: Quark, title: string, projects: Project[]): void {
    const collapsible = new CollapsibleBase(title, '');
    collapsible.render(q);

    const table = new ProjectTable(projects, ProjectsView.TABLE_HEADERS, {}, 'status', '');

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

    $(q, 'div', 'projects validator', {}, (q) => {
      const pendingProjects = this.projects[0]!;
      const completedProjects = this.projects[1]!;

      this.renderProjectSection(q, 'Pending Projects', pendingProjects);
      this.renderProjectSection(q, 'Completed Projects', completedProjects);
    });
  }
}

export const projectsViewHandler = new ViewHandler('projects', ProjectsView);
