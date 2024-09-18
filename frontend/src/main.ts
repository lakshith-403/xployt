import './styles/styles.scss';
import { Quark, QuarkFunction as $ } from './ui_lib/quark';
import { RouteHandler } from './ui_lib/route';
import './ui_lib/router';
import { router } from './ui_lib/router';
import { NavigationView } from './ui_lib/view';

import { homeViewHandler } from './views/home';
import { loginViewHandler } from './views/Login';
import { projectsViewHandler } from './views/validator/projects/Projects';

import { SidebarTab, SidebarView } from './components/SideBar/SideBar';
import { registerViewHandler } from './views/Register';
import { projectDashboardViewHandler } from './views/validator/projectDashboard/projectDashboard';
import { reportsViewHandler } from './views/projectLead/Reports/Report';
import { vulnReportViewHandler } from './views/hacker/VulnerabilityReport/VulnerabilityReport';
import { profileViewHandler } from './views/Profile';
import { validatorApplicationViewHandler } from './views/validator/validatorApplication/validatorApplication';

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
    id: 'report/{projectId}',
    title: 'New Report',
    url: 'report/1',
  },
  {
    id: 'validator/application',
    title: 'Application',
    url: 'validator/application',
  },
];

class AboutSidebarView implements NavigationView {
  baseURL: string = '/about';

  willUpdate: () => void = () => {};

  render(q: Quark): void {
    q.innerHTML = '';
    $(q, 'ul', '', {}, (q) => {
      $(q, 'li', '', {}, (q) => {
        $(q, 'a', '', {}, 'Login').addEventListener('click', () => {
          router.navigateTo(this.baseURL + '/login/user');
        });
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
        $(q, 'button', '', { onclick: () => { router.navigateTo('/'); } }, 'Home');
        $(q, 'button', '', { onclick: () => { router.navigateTo('/about'); } }, 'About');
        $(q, 'button', '', { onclick: () => { router.navigateTo('/profile'); } }, 'Profile');
      });
    // prettier-ignore
  }
}

const HomeRouteHandler = new RouteHandler(
  '/',
  [homeViewHandler, projectsViewHandler, vulnReportViewHandler, reportsViewHandler, validatorApplicationViewHandler],
  new SidebarView('/', HomeSidebar)
);
const ProjectRouteHandler = new RouteHandler('/projects', [projectDashboardViewHandler], undefined, false, false, false);
const AboutRouteHandler = new RouteHandler('/about', [homeViewHandler, loginViewHandler], new AboutSidebarView());

const RegisterRouteHandler = new RouteHandler('/register', [registerViewHandler], undefined, true);
const LoginRouteHandler = new RouteHandler('/login', [loginViewHandler], undefined, true, true);
const ProfileRouteHandler = new RouteHandler('/profile', [profileViewHandler]);

// const HomeRouteHandler = new RouteHandler('/', [homeViewHandler, projectsViewHandler, projectInfoViewHandler], new SidebarView('/', HomeSidebar));
// const AboutRouteHandler = new RouteHandler('/about', [homeViewHandler, loginViewHandler], new AboutSidebarView());
// const LoginRouteHandler = new RouteHandler('/login', [loginViewHandler], undefined, true, true);

router.setTopNavigationView(new TopNavigationView());

router.addRouteHandler(HomeRouteHandler);
router.addRouteHandler(ProjectRouteHandler);
router.addRouteHandler(AboutRouteHandler);
router.addRouteHandler(RegisterRouteHandler);
router.addRouteHandler(LoginRouteHandler);
router.addRouteHandler(ProfileRouteHandler);
