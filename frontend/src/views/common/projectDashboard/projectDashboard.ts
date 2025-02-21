import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import Tabs from '@components/tabs/tabs';
import './projectDashboard.scss';
import OverviewTab from './tabOverview';
import DiscussionTab from './tabDiscussion';
import TeamTab from './tabTeam';
import NETWORK from '@/data/network/network';
class projectDashboardView extends View {
  params: { projectId: string };
  private projectTitle!: string;

  constructor(params: { projectId: string }) {
    console.log('projectDashboardView constructor executed');
    super(params);
    this.params = params;
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
    try {
      const response = await NETWORK.get(`/api/project/${this.params.projectId}`, { showLoading: true, handleError: true, throwError: true });
      console.log('response: ', response.data);
      this.projectTitle = response.data.title;
    } catch (error) {
      console.error('Failed to load project data:', error);
      this.projectTitle = 'Error Loading Project';
    }
    q.innerHTML = '';

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
