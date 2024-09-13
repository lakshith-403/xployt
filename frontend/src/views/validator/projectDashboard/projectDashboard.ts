import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import Tabs from './../../../components/tabs/tabs';
import './projectDashboard.scss';
import OverviewTab from './tabOverview';
import DiscussionTab from './tabDiscussion';
import TeamTab from './tabTeam';
import { BREADCRUMBS, Breadcrumbs } from '../../../components/breadCrumbs/breadCrumbs';
class projectDashboardView implements View {
  params: { projectId: string };

  constructor(params: { projectId: string }) {
    this.params = params;
    Breadcrumbs.render();
  }

  render(q: Quark): void {
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
      $(q, 'span', 'project-title', {}, 'Project Dashboard');
      $(q, 'span', 'project-number', {}, ' - #2306');
      $(q, 'div', 'info', {}, (q) => {
        tabsComponent.render(q);
      });
    });
  }
}

export const projectDashboardViewHandler = new ViewHandler('/{projectId}', projectDashboardView);
