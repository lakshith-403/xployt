import './styles/styles.scss';
import { Quark, QuarkFunction as $ } from './ui_lib/quark';
import { RouteHandler } from './ui_lib/route';
import './ui_lib/router';
import { Router } from './ui_lib/router';
import { NavigationView } from './ui_lib/view';
import { homeViewHandler } from './views/home';
import { loginViewHandler } from './views/Login';

import { projectInfoViewHandler } from './views/validator/ProjectInfo/ProjectInfo';
import { projectsViewHandler } from './views/validator/projects/Projects';
import { sideBarTestViewHandler } from './views/validator/SideBarTest/SideBarTest';
import { SidebarTab, SidebarView } from './components/SideBar/SideBar';

import {
  vulnReportViewHandler,
} from './views/hacker/VulnerabilityReport/VulnerabilityReport';

const HomeSidebar: SidebarTab[] = [
  {
    id: 'home',
    title: 'Home',
    url: '/',
  },
  {
    id: 'projects',
    title: 'Projects',
    url: '/projects',
  },
  {
    id: 'report',
    title: 'Report',
    url: '/report',
  },
];

class AboutSidebarView implements NavigationView {
  baseURL: string = '/about';

  willUpdate: () => void = () => {};

  render(q: Quark): void {
    q.innerHTML = '';
    $(q, 'ul', '', {}, (q) => {
      $(q, 'li', '', {}, (q) => {
        $(q, 'a', '', { href: this.baseURL + '/login/user' }, 'Login');
      });
    });
  }
}

class TopNavigationView implements NavigationView {
  baseURL: string = '';

  willUpdate: () => void = () => {};

  render(q: Quark): void {
    q.innerHTML = '';
    $(q, 'ul', '', {}, (q) => {
      $(q, 'li', '', {}, (q) => {
        $(q, 'a', '', { href: '/' }, 'Home');
        $(q, 'a', '', { href: '/about' }, 'About');
      });
    });
  }
}

const HomeRouteHandler = new RouteHandler(
  '/',
  [homeViewHandler, projectsViewHandler, vulnReportViewHandler],
  new SidebarView('/', HomeSidebar)
);
const AboutRouteHandler = new RouteHandler(
  '/about',
  [homeViewHandler, loginViewHandler],
  new AboutSidebarView()
);

// const ReportRouteHandler = new RouteHandler(
//     '/report',
//     [homeViewHandler, vulnReportViewHandler],
//     new SidebarView('/report', HomeSidebar)
// );

const router = new Router(
  [HomeRouteHandler, AboutRouteHandler,
    // ReportRouteHandler
    ],
  new TopNavigationView()
);
