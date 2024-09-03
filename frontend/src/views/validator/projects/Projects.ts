import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './Projects.scss';
// import './../../../components/loadingScreen/loadingScreen.scss';

import { Project, ProjectsCache } from '../../../data/validator/cache/projects.cache';
import { UserCache, UserCacheMock } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';
import loadingScreen from '../../../components/loadingScreen/loadingScreen';
import { projectsCollabsible } from '../../../components/Collapsible/projectsCollapsible';
import { CollapsibleBase } from '../../../components/Collapsible/collap';
import { tableBase } from '../../../components/table/table.base';

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
    // console.log('param is', params);
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

    $(q, 'div', 'projects validator', {}, (q) => {
      const div = $(q, 'h2', 'Projects', {}, 'Projects');

      const tableHeader = ['ID', 'Title', 'Client', 'Status', 'Pending Reports'];
      new projectsCollabsible(q, 'On-going Projects', this.Projects[0]!, tableHeader, 'tables');
      new projectsCollabsible(q, 'Completed Projects', this.Projects[1]!, tableHeader, 'tables');

      const collapsile = new CollapsibleBase('Pending Projects');
      collapsile.render(q);
      const onGoingProjects = new tableBase(this.Projects[0]!, tableHeader, 'tables');
      onGoingProjects.render(collapsile.getContent());
    });
  }
}

export const projectsViewHandler = new ViewHandler('projects', ProjectsView);
