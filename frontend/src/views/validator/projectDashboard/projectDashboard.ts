import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import Tabs from './../../../components/tabs/tabs';
import './projectDashboard.scss';
import OverviewTab from './tabOverview';
import DiscussionTab from './tabDiscussion';
import TeamTab from './tabTeam';
class projectDashboardView implements View {
  params: { projectId: string };

  constructor(params: { projectId: string }) {
    this.params = params;
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
        title: 'Discussion',
        render: (q: Quark) => {
          discussionTab.render(q);
        },
      },
      {
        title: 'Team',
        render: (q: Quark) => {
          teamTab.render(q);
        },
      },
    ];

    const tabsComponent = new Tabs(tabs);
    $(q, 'div', 'projectDashboard', {}, (q) => {
      $(q, 'span', 'projectDashboard__title', {}, 'Project Dashboard');
      $(q, 'span', '', {}, 'project_Number');
    });
    tabsComponent.render(q);
  }
}

export const projectDashboardViewHandler = new ViewHandler('/{projectId}', projectDashboardView);
