import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './projects.scss';
// import './../../../components/loadingScreen/loadingScreen.scss';

import { Project, ProjectsCache } from '../../../data/validator/cache/projects.cache';
import { UserCache, UserCacheMock } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';
import loadingScreen from '../../../components/loadingScreen/loadingScreen';
class ProjectsView implements View {
  params: { projectId: string };
  projectsCache: ProjectsCache;
  userCache: UserCache;
  Projects: Project[][] | [][] = [[]];
  userId: number | null = null;

  constructor(params: { projectId: string }) {
    this.params = params;
    this.userCache = CACHE_STORE.getUser('1');
    this.projectsCache = CACHE_STORE.getProjects();
    console.log('param is', params);
  }
  async loadProjects(): Promise<void> {
    try {
      this.userId = (await this.userCache.get()).id;
      this.Projects = await this.projectsCache.get(false, this.userId);
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    const loading = new loadingScreen(q);
    loading.show();
    await this.loadProjects();
    loading.hide();
    this.Projects[0]!.forEach((project: Project) => {
      $(q, 'div', 'project', {}, (q) => {
        $(q, 'span', 'project-title', {}, project.title);
        $(q, 'span', 'project-client', {}, project.client);
        $(q, 'span', 'project-status', {}, project.status);
        $(q, 'span', 'project-reports', {}, project.pendingReports.toString());
      });
    });
  }
}

export const projectsViewHandler = new ViewHandler('projects', ProjectsView);
