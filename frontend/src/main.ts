import './styles/styles.scss';
import './styles/custom-bootstrap.scss';
import { Quark, QuarkFunction as $ } from './ui_lib/quark';
import { RouteHandler } from './ui_lib/route';
import './ui_lib/router';
import { router } from './ui_lib/router';
import { NavigationView } from './ui_lib/view';

import { homeViewHandler } from './views/home';
import { loginViewHandler } from './views/Login';
import { projectsViewHandler } from './views/common/projects/Projects';

import { SidebarTab, SidebarView } from './components/SideBar/SideBar';
import { registerViewHandler } from './views/Register';
import { projectDashboardViewHandler } from '@views/common/projectDashboard/projectDashboard';
import { reportsViewHandler } from './views/projectLead/Reports/Report';
import { verifyProjectHandler } from '@views/common/projectDashboard/tabOverviewContent/leadComponents/verifyProject';
import { projectConfigFormViewHandler } from '@views/common/projectDashboard/tabOverviewContent/leadComponents/configureProject/projectConfigForm';
import { vulnReportViewHandler } from './views/hacker/VulnerabilityReport/VulnerabilityReport';
import { profileViewHandler } from './views/Profile';
import { validatorApplicationViewHandler } from './views/validator/validatorApplication/validatorApplication';
// import { tagInputTestViewHandler } from './views/validator/test/tagInputTest';
import { validatorDashboardViewHandler } from './views/validator/dashboard/dashboard';
import { projectRequestFormViewHandler } from './views/client/projectRequestForm/projectRequestForm';
import { NotificationList } from '@components/notifications/notificationsList';
import { NotificationButton } from '@components/notifications/notificationButton';
import { discussionViewHandler } from './views/discussion/Discussion';
import { UserRoleToggler } from '@components/userRoleToggler/userRoleToggler';
import { userDashboardViewHandler } from '@views/UserDashboard';
import { clientHackerInvitationsViewHandler } from '@views/client/inviteHackers/inviteHackers';
import { Button } from './components/button/base';
import { CACHE_STORE } from './data/cache';
import { convertToDom } from './components/ModalManager/ModalManager';
import ModalManager from './components/ModalManager/ModalManager';
import alertOnlyCancel from '@alerts/alertOnlyCancel.html';
import {landingPageViewHandler} from "@views/common/LandingPages/landing.base";
// import alertOnlyConfirm from '@alerts/alertOnlyConfirm.html';
// import alertCancelConfirm from '@alerts/alertCancelConfirm.html';

export const modalAlertOnlyCancel = convertToDom(alertOnlyCancel);
ModalManager.includeModal('alertOnlyCancel', {
  '.button-cancel': () => ModalManager.hide('alertOnlyCancel'),
});

// export const modalAlertOnlyConfirm = convertToDom(alertOnlyConfirm);
// ModalManager.includeModal('alertOnlyConfirm', {
//   '.button-confirm': () => ModalManager.hide('alertOnlyConfirm'),
// });

// export const modalAlertCancelConfirm = convertToDom(alertCancelConfirm);
// ModalManager.includeModal('alertCancelConfirm', {
//   '.button-cancel': () => ModalManager.hide('alertCancelConfirm'),
//   '.button-confirm': () => ModalManager.hide('alertCancelConfirm'),
// });

const HomeSidebar: SidebarTab[] = [
  // {
  //   id: '',
  //   title: 'Home',
  //   url: '',
  // },
  {
    id: 'dashboard',
    title: 'Dashboard',
    url: 'dashboard',
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
  // {
  //   id: 'discussion',
  //   title: 'Discussion',
  //   url: 'discussion',
  // },
  // {
  //   id: 'report/{projectId}',
  //   title: 'New Report',
  //   url: 'report/1',
  // },
  // {
  //   id: 'validator/application',
  //   title: 'Application',
  //   url: 'validator/application',
  // },
  // {
  //   id: 'test/tagInput',
  //   title: 'Tag Input Test',
  //   url: 'test/tagInput',
  // },
  // {
  //   id: 'project-request',
  //   title: 'Project Request',
  //   url: 'project-request',
  // },
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
  buttonContainer!: Quark;

  willUpdate: () => void = () => {};

  render(q: Quark): void {
    let parent = q;
    q.innerHTML = '';
    const logo = $(q, 'img', 'icon-image', { src: './../assets/xployt-logo.png' });
    logo.onclick = () => router.navigateTo('/');
    $(q, 'div', 'buttons', {}, (q) => {
      const notificationList = new NotificationList(false, { userId: '1' });
      const notificationButton = new NotificationButton(notificationList, q);
      notificationButton.render();
      $(
        q,
        'button',
        '',
        {
          onclick: () => {
            router.navigateTo('/');
          },
        },
        'Home'
      );
      $(
        q,
        'button',
        '',
        {
          onclick: () => {
            router.navigateTo('/');
          },
        },
        'Hackers'
      );
      $(
        q,
        'button',
        '',
        {
          onclick: () => {
            router.navigateTo('/validator/application');
          },
        },
        'Validators'
      );
      $(
        q,
        'button',
        '',
        {
          onclick: () => {
            router.navigateTo('/validator/application');
          },
        },
        'Organizations'
      );

      this.buttonContainer = $(q, 'span', '', {}, (q) => {});
      $(
        q,
        'button',
        '',
        {
          onclick: () => {
            router.navigateTo('/profile');
          },
        },
        'Profile'
      );
    });
    this.renderButtons();
  }

  private renderButtons(): void {
    this.buttonContainer.innerHTML = '';

    CACHE_STORE.getUser()
      .get()
      .then((user) => {
        console.log(user);
        // @ts-ignore
        if (user.type != 'Guest') {
          new Button({
            label: 'Sign Out',
            onClick: () => {
              CACHE_STORE.getUser().signOut();
              router.navigateTo('/');
              this.renderButtons();
            },
          }).render(this.buttonContainer);
        } else {
          new Button({
            label: 'Sign In',
            onClick: () => {
              router.navigateTo('/login');
              this.renderButtons();
            },
          }).render(this.buttonContainer);
        }
      });
  }
}

const HomeRouteHandler = new RouteHandler('/', [homeViewHandler], undefined, false, false, true);

const CommonRouteHandlers = new RouteHandler(
  '/',
  [
    projectsViewHandler,
    vulnReportViewHandler,
    reportsViewHandler,
    validatorApplicationViewHandler,
    // tagInputTestViewHandler,
    validatorDashboardViewHandler,
    projectRequestFormViewHandler,
    discussionViewHandler,
    userDashboardViewHandler,
    clientHackerInvitationsViewHandler,
  ],
  new SidebarView('/', HomeSidebar),
  false,
  false,
  false,
  true
);
const ProjectRouteHandler = new RouteHandler('/projects', [projectDashboardViewHandler, verifyProjectHandler, projectConfigFormViewHandler], undefined, false, false, false, true);
const AboutRouteHandler = new RouteHandler('/about', [homeViewHandler, loginViewHandler], new AboutSidebarView());

const RegisterRouteHandler = new RouteHandler('/register', [registerViewHandler], undefined, true);
const LoginRouteHandler = new RouteHandler('/login', [loginViewHandler], undefined, true, true);
const LandingRouteHandler = new RouteHandler('/landing', [landingPageViewHandler], undefined, false, false);
const ProfileRouteHandler = new RouteHandler('/profile', [profileViewHandler], undefined, false, false, false, true);

const DiscussionRouteHandler = new RouteHandler('/discussion', [discussionViewHandler], undefined, false, false, false, true);

// const HomeRouteHandler = new RouteHandler('/', [homeViewHandler, projectsViewHandler, projectInfoViewHandler], new SidebarView('/', HomeSidebar));
// const AboutRouteHandler = new RouteHandler('/about', [homeViewHandler, loginViewHandler], new AboutSidebarView());
// const LoginRouteHandler = new RouteHandler('/login', [loginViewHandler], undefined, true, true);

router.setTopNavigationView(new TopNavigationView());

router.addRouteHandler(HomeRouteHandler);
router.addRouteHandler(CommonRouteHandlers);
router.addRouteHandler(ProjectRouteHandler);
router.addRouteHandler(AboutRouteHandler);
router.addRouteHandler(RegisterRouteHandler);
router.addRouteHandler(LoginRouteHandler);
router.addRouteHandler(ProfileRouteHandler);
router.addRouteHandler(LandingRouteHandler);

// Instantiate the UserRoleToggler to attach it to the page
// new UserRoleToggler();
