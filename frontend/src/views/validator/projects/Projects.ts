import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './projects.scss';
import {
  ProjectInfo,
  ProjectInfoCache,
} from '../../../data/validator/cache/projectInfo';
import { Project, ProjectsCache } from '../../../data/validator/cache/projects';
import { UserCache, UserCacheMock } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';

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
    const waiting = $(q, 'div', 'loading-screen', {}, (q) => {
      $(q, 'div', 'spinner', {}, (q) => {});
    });
    await this.loadProjects();
    waiting.innerHTML = '';
    waiting.remove();
    // $(waiting, 'div', 'loading-screen', {}, (q) => {
    //   q.innerHTML = '';
    // });
  }
}

export const projectsViewHandler = new ViewHandler('projects', ProjectsView);
