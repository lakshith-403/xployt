import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import Tabs from './../../../components/tabs/tabs';
import './projectDashboard.scss';
import OverviewTab from './tabOverview';
import DiscussionTab from './tabDiscussion';
import TeamTab from './tabTeam';
import { CACHE_STORE } from '../../../data/cache';
import { Project, ProjectsCache } from '../../../data/validator/cache/projects.cache';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';

// import { BREADCRUMBS, Breadcrumbs } from '../../../components/breadCrumbs/breadCrumbs';
class projectDashboardView extends View {
  params: { projectId: string };
  // private project: Project = {} as Project;
  private projectsCache: ProjectsCache;
  private projectTitle!: string;
  constructor(params: { projectId: string }) {
    super(params);
    this.params = params;
    this.projectsCache = CACHE_STORE.getProjects();
  }
  async loadProject(): Promise<void> {
    try {
      // const userCache = CACHE_STORE.getUser('1');
      // const user = await userCache.get();
      // console.log(user);
      const projects: Project[][] = await this.projectsCache.get(false, this.params.projectId);
      this.projectTitle = projects.flatMap((projectArray) => projectArray).find((project) => project.id === Number(this.params.projectId))?.title ?? '';
      console.log(this.projectTitle);
      // this.project = projects[0][0];
    } catch (error) {
      console.error('Failed to load project data', error);
    }
  }

  protected shouldRenderBreadcrumbs(): boolean {
    return true;
  }

  protected setupBreadcrumbs(params: { projectId: string }): void {
    this.breadcrumbs?.clearBreadcrumbs();
    this.breadcrumbs?.addBreadcrumb({
      label: `Projects`,
      link: `/projects`,
    });
    this.breadcrumbs?.addBreadcrumb({
      label: `Project #${params.projectId}`,
      link: `/projects/${params.projectId}`,
    });
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();

    await this.loadProject();
    loading.hide();

    const overviewTab = new OverviewTab(this.params.projectId);
    const discussionTab = new DiscussionTab(this.params.projectId);
    const teamTab = new TeamTab(this.params.projectId);

    const tabs = [
      {
        title: 'Overview',
        render: (q: Quark) => {
          overviewTab.render(q);
        },
      },
      {
        title: 'Team',
        render: (q: Quark) => {
          teamTab.render(q);
        },
      },
      {
        title: 'Discussion',
        render: (q: Quark) => {
          discussionTab.render(q);
        },
      },
    ];

    const tabsComponent = new Tabs(tabs);
    $(q, 'div', 'projectDashboard', {}, (q) => {
      $(q, 'span', 'project-title', {}, this.projectTitle);
      $(q, 'span', 'project-number', {}, ' - #' + this.params.projectId);
      $(q, 'div', 'info', {}, (q) => {
        tabsComponent.render(q);
      });
    });
  }
}

export const projectDashboardViewHandler = new ViewHandler('/{projectId}', projectDashboardView);
