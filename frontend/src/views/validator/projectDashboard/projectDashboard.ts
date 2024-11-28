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

class projectDashboardView extends View {
  params: { projectId: string };
  private projectsCache: ProjectsCache;
  private projectTitle!: string;

  constructor(params: { projectId: string }) {
    console.log('projectDashboardView constructor executed');
    super(params);
    this.params = params;
    this.projectsCache = CACHE_STORE.getProjects();
  }
  async loadProject(): Promise<void> {
    try {
      console.log('loadProject executed');
      console.log('project id is ', this.params.projectId);
      const projects: Project[][] = await this.projectsCache.get(false, this.params.projectId);

      // Flatten the array and find the project
      const flatProjects = projects.flatMap((projectArray) => projectArray);
      const project = flatProjects.find((project) => String(project.id) === String(this.params.projectId));

      if (!project) {
        console.error('Project not found');
        this.projectTitle = 'Project ';
        return;
      }

      this.projectTitle = project.title;
      console.log('Project title set to:', this.projectTitle);
    } catch (error) {
      console.error('Failed to load project data:', error);
      this.projectTitle = 'Error Loading Project';
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
    q.innerHTML = '';
    console.log('projectDashboardView render executed');
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
