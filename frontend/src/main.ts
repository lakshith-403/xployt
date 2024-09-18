import './styles/styles.scss';
import { Quark, QuarkFunction as $ } from './ui_lib/quark';
import { RouteHandler } from './ui_lib/route';
import './ui_lib/router';
import { Router } from './ui_lib/router';
import { NavigationView } from './ui_lib/view';

import { homeViewHandler } from './views/home';
import { loginViewHandler } from './views/Login';
import { projectsViewHandler } from './views/validator/projects/Projects';

import { SidebarTab, SidebarView } from './components/SideBar/SideBar';
import { projectInfoViewHandler } from './views/validator/ProjectInfo/ProjectInfo';
import { projectDashboardViewHandler } from './views/validator/projectDashboard/projectDashboard';
import { reportsViewHandler } from './views/projectLead/Reports/Report';
import { vulnReportViewHandler } from './views/hacker/VulnerabilityReport/VulnerabilityReport';
import { dashboardViewHandler } from './views/User/Dashbaord/UserDashboard';

const HomeSidebar: SidebarTab[] = [
  {
    id: '',
    title: 'Home',
    url: '',
  },
  {
    id: 'projects',
    title: 'Projects',
    url: 'projects',
  },
  {
    id: 'reports',
    title: 'Reports',
    url: 'reports',
  },
  {
    id: 'project/{projectId}',
    title: 'Project Info',
    url: 'project/1',
  },
  {
    id: 'report/{projectId}',
    title: 'New Report',
    url: 'report/1',
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
    $(q, 'img', 'icon-image', { src: './../assets/xployt-logo.png' });
    $(q, 'div', 'buttons', {}, (q) => {
        $(q, 'button', '', { onclick: () => { window.location.href = '/'; } }, 'Home');
        $(q, 'button', '', { onclick: () => { window.location.href = '/about'; } }, 'About');

      });
    // prettier-ignore
  }
}

const HomeRouteHandler = new RouteHandler('/', [homeViewHandler, projectsViewHandler, projectInfoViewHandler, vulnReportViewHandler, reportsViewHandler, dashboardViewHandler], new SidebarView('/', HomeSidebar));
const ProjectRouteHandler = new RouteHandler('/projects', [projectDashboardViewHandler], undefined, false, false, false);
const AboutRouteHandler = new RouteHandler('/about', [homeViewHandler, loginViewHandler], new AboutSidebarView());
const LoginRouteHandler = new RouteHandler('/login', [loginViewHandler], undefined, true, true);
const DashboardRouteHandler = new RouteHandler('/dashboard', [dashboardViewHandler], undefined, false, false, false);

// const HomeRouteHandler = new RouteHandler('/', [homeViewHandler, projectsViewHandler, projectInfoViewHandler], new SidebarView('/', HomeSidebar));
// const AboutRouteHandler = new RouteHandler('/about', [homeViewHandler, loginViewHandler], new AboutSidebarView());
// const LoginRouteHandler = new RouteHandler('/login', [loginViewHandler], undefined, true, true);

const router = new Router([HomeRouteHandler, AboutRouteHandler, LoginRouteHandler, ProjectRouteHandler], new TopNavigationView());
