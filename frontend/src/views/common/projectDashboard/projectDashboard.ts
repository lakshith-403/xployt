import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import Tabs from '@components/tabs/tabs';
import './projectDashboard.scss';
import OverviewTab from './tabOverview';
import DiscussionTab from './tabDiscussion';
import TeamTab from './tabTeam';
import PaymentsTab from './tabPayments';
import NETWORK from '@/data/network/network';
import { CACHE_STORE } from '@/data/cache';
import ReportsTab from './tabReports';
import TabSettings from '@views/common/projectDashboard/TabSettings';
import ComplaintsTab from './tabComplaints';
class projectDashboardView extends View {
  params: { projectId: string };
  private projectTitle!: string;
  private userId!: string;
  private projectInfo!: any;
  constructor(params: { projectId: string }) {
    console.log('projectDashboardView constructor executed');
    super(params);
    this.params = params;
    this.userId = '';
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
      const currentUser = await CACHE_STORE.getUser().get();
      const response = await NETWORK.get(`/api/single-project/${this.params.projectId}?role=${currentUser.type}`, { showLoading: true, handleError: true, throwError: true });
      console.log('response: ', response.data);
      this.projectInfo = response.data.project;
      this.projectTitle = response.data.project.title;
    } catch (error) {
      console.error('Failed to load project data:', error);
      this.projectTitle = 'Error Loading Project';
    }
    q.innerHTML = '';

    const currentUser = await CACHE_STORE.getUser().get();
    this.userId = currentUser.id;

    const overviewTab = new OverviewTab(this.params.projectId, () => this.rerender());
    const discussionTab = new DiscussionTab(this.params.projectId);
    const teamTab = new TeamTab(this.params.projectId);
    const reportsTab = new ReportsTab(this.params.projectId);
    const settingsTab = currentUser.type === 'Client' ? new TabSettings(this.params.projectId) : null;
    const complaintsTab = new ComplaintsTab(this.params.projectId);

    const tabs = [];

    const commonTabs = [
      {
        title: 'Team',
        render: (q: Quark) => {
          teamTab.render(q);
        },
      },
      {
        title: 'Overview',
        render: (q: Quark) => {
          overviewTab.render(q);
        },
      },
      {
        title: 'Reports',
        render: (q: Quark) => {
          reportsTab.render(q);
        },
      },
      {
        title: 'Discussion',
        render: (q: Quark) => {
          discussionTab.render(q);
        },
      },
      {
        title: 'Complaints',
        render: (q: Quark) => {
          complaintsTab.render(q);
        },
      },
    ];

    tabs.push(...commonTabs);

    const usersWithPaymentsTab = ['ProjectLead', 'Client', 'Hacker', 'Admin'];
    if (usersWithPaymentsTab.includes(currentUser.type)) {
      const paymentsTab = new PaymentsTab(this.params.projectId, currentUser, this.projectInfo);
      tabs.push({
        title: 'Payments',
        render: (q: Quark) => {
          paymentsTab.render(q);
        },
      });
    }

    if (currentUser.type === 'Client') {
      tabs.push({
        title: 'Settings',
        render: (q: Quark) => {
          settingsTab?.render(q);
        },
      });
    }

    const tabsComponent = new Tabs(tabs);
    $(q, 'div', 'projectDashboard', {}, (q) => {
      $(q, 'span', 'title-container', {}, (q) => {
        $(q, 'span', 'title-info', {}, (q) => {
          $(q, 'span', 'project-title', {}, this.projectTitle);
          $(q, 'span', 'project-number', {}, ' - #' + this.params.projectId);
        });
        $(q, 'span', `project-status project-status-${this.projectInfo.state.toLowerCase()}`, {}, (q) => {
          $(q, 'span', 'status-indicator', {});
          $(q, 'span', 'status-text', {}, this.projectInfo.state);
        });
      });
      $(q, 'div', 'info', {}, (q) => {
        tabsComponent.render(q);
      });
    });
  }
}

export const projectDashboardViewHandler = new ViewHandler('/{projectId}', projectDashboardView);
