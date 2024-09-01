import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './sideBarTest.scss';
import { SidebarTab } from './../../../components/SideBar/SideBar';
// import ProjectInfo from './C_ProjectInfo';
// import ProjectTeam from './C_ProjectTeam';
// import ProjectScope from './C_ProjectScope';

class SideBarTestView implements View {
  params: { type: string };
  // handler: ReturnType<typeof sidebarViewHandler>;

  constructor(params: { type: string }) {
    this.params = params;
    // this.handler = sidebarViewHandler(sidebarTabs);
  }
  render(q: Quark): void {
    $(q, 'div', 'sideBarTest validator', {}, (q) => {
      // this.handler.render(q);
    });
  }
}

export const sideBarTestViewHandler = new ViewHandler(
  '/sidebartest',
  SideBarTestView
);

// Example usage
const sidebarTabs: SidebarTab[] = [
  {
    id: 'projectInfo',
    title: 'Project Information',
    url: '/sidebartest/projectInfo',
  },
  {
    id: 'projectScope',
    title: 'Project Scope',
    url: '/sidebartest/projectScope',
  },
  {
    id: 'projectTeam',
    title: 'Project Team',
    url: '/sidebartest/projectTeam',
  },
];
