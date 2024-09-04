import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './Projects.scss';
import { Project, ProjectsCache } from '../../../data/validator/cache/projects.cache';
import { UserCache, UserCacheMock } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';
import loadingScreen from '../../../components/loadingScreen/loadingScreen';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { FilterableTable } from '../../../components/table/filerable.table';
import { CheckboxManager } from '../../../components/checkboxManager/checkboxManager';

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
      const tableHeader = ['ID', 'Status', 'Title', 'Client', 'Pending Reports'];

      const collapsible_1 = new CollapsibleBase('Pending Projects', '');
      collapsible_1.render(q);
      const onGoingProjects = new FilterableTable(this.Projects[0]!, tableHeader, {}, 'status', '');
      const onCheckboxChange_1 = (checkboxValues: { [key: string]: boolean }) => {
        console.log(checkboxValues);
        onGoingProjects.updateRows(checkboxValues);
      };
      const checkboxManager_1 = new CheckboxManager(['pending', 'closed', 'in progress'], onCheckboxChange_1);
      $(collapsible_1.getContent(), 'div', 'filter-bar', {}, (q) => {
        $(q, 'span', 'filter-bar-title', {}, 'Filter:');
        checkboxManager_1.render(q);
      });
      onGoingProjects.render(collapsible_1.getContent());

      const collapsible_2 = new CollapsibleBase('Completed Projects', '');
      collapsible_2.render(q);
      const closedProjects = new FilterableTable(this.Projects[0]!, tableHeader, {}, 'status', '');
      const onCheckboxChange_2 = (checkboxValues: { [key: string]: boolean }) => {
        console.log(checkboxValues);
        closedProjects.updateRows(checkboxValues);
      };
      const checkboxManager_2 = new CheckboxManager(['pending', 'closed', 'in progress'], onCheckboxChange_2);
      $(collapsible_2.getContent(), 'div', 'filter-bar', {}, (q) => {
        $(q, 'span', 'filter-bar-title', {}, 'Filter:');
        checkboxManager_2.render(q);
      });
      closedProjects.render(collapsible_2.getContent());
    });
  }
}

export const projectsViewHandler = new ViewHandler('projects', ProjectsView);
