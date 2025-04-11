//styles
import './styles/styles.scss';
import './styles/X-bootstrap.scss';
import './styles/X-typography.scss';
import './styles/X-colors.scss';
//utils
import { Quark, QuarkFunction as $ } from './ui_lib/quark';
import { RouteHandler } from '@ui_lib/route';
import './ui_lib/router';
import { router } from '@ui_lib/router';
import { NavigationView } from '@ui_lib/view';

//components
import { SidebarTab, SidebarView } from '@components/SideBar/SideBar';
import { NotificationList } from '@components/notifications/notificationsList';
import { NotificationButton } from '@components/notifications/notificationButton';
import { Button } from '@components/button/base';
import { convertToDom } from '@components/ModalManager/ModalManager';
import ModalManager from './components/ModalManager/ModalManager';

//alerts
import alertOnlyOK from '@alerts/alertOnlyOK.html';
import alertForErrors from '@alerts/alertForErrors.html';
import alertOnlyCancel from '@alerts/alertOnlyCancel.html';

//cache
import { CACHE_STORE } from '@data/cache';

//view handlers
import { homeViewHandler } from '@views/home';
import { loginViewHandler } from '@views/Login';
import { projectsViewHandler } from '@views/common/projects/Projects';
import { registerViewHandler } from '@views/Register';
import { projectDashboardViewHandler } from '@views/common/projectDashboard/projectDashboard';
import { reportsViewHandler } from '@views/projectLead/Reports/Report';
import { verifyProjectHandler } from '@views/common/projectDashboard/tabOverviewContent/leadComponents/verifyProject';
import { projectConfigFormViewHandler } from '@views/common/projectDashboard/tabOverviewContent/leadComponents/configureProject/projectConfigForm';
import { vulnReportViewHandler } from '@views/hacker/VulnerabilityReport/VulnerabilityReportForm';
import { profileViewHandler } from '@views/Profile';
import { validatorApplicationViewHandler } from '@views/validator/validatorApplication/validatorApplication';
// import { validatorDashboardViewHandler } from '@views/validator/dashboard/dashboard';
import { projectRequestFormViewHandler } from '@views/client/projectRequestForm/projectRequestForm';
import { discussionViewHandler } from '@views/discussion/Discussion';
import { userDashboardViewHandler } from '@views/UserDashboard';
import { clientHackerInvitationsViewHandler } from '@views/client/inviteHackers/inviteHackers';
import { hackerLandingPageViewHandler } from '@views/common/LandingPages/landing.hacker';
import { clientLandingPageViewHandler } from '@views/common/LandingPages/landing.client';
import { validatorLandingPageViewHandler } from '@views/common/LandingPages/landing.validator';
import { adminLoginViewHandler } from '@views/admin/Login';
import { validatorApplicationsViewHandler } from '@views/admin/validatorApplications/apllications';
import { adminDashboardViewHandler } from '@views/admin/dashboard/dashboard';
import { listValidatorsViewHandler } from '@views/admin/promoteToLead/listValidators';
import { listUsersViewHandler } from '@views/admin/userManagement/listUsers';
import { styleGuideViewHandler } from '@views/common/styleGuide';
import { adminProjectsViewHandler } from '@views/admin/projects/Projects';

// Sidebars
import { HomeSidebar, AdminSidebar } from '@views/sideBars';
import {vulnReportReviewViewHandler} from "@views/common/ReportReview/ReportReview";

// Generic Alerts : Can be used anywhere
export const modalAlertOnlyCancel = convertToDom(alertOnlyCancel);
ModalManager.includeModal('alertOnlyCancel', {
  '.button-cancel': () => ModalManager.hide('alertOnlyCancel'),
});

export const modalAlertOnlyOK = convertToDom(alertOnlyOK);
ModalManager.includeModal('alertOnlyOK', {
  '.button-ok': () => ModalManager.hide('alertOnlyOK'),
});

export const modalAlertForErrors = convertToDom(alertForErrors);
ModalManager.includeModal('alertForErrors', {
  '.button-ok': () => ModalManager.hide('alertForErrors'),
});

class TopNavigationView implements NavigationView {
  baseURL: string = '';
  buttonContainer!: Quark;
  userType!: Quark;

  willUpdate: () => void = () => {};

  render(q: Quark): void {
    let parent = q;
    q.innerHTML = '';
    const logo = $(q, 'img', 'icon-image', { src: './../assets/xployt-logo.png' });
    logo.onclick = () => router.navigateTo('/');
    $(q, 'div', 'buttons', {}, (q) => {
      this.userType = $(q, 'span', 'user-type text-light-green', {}, '');
      const notificationList = new NotificationList(false, { userId: '1' });
      const notificationButton = new NotificationButton(notificationList, q);
      notificationButton.render();

      $(q, 'button', '', { onclick: () => router.navigateTo('/') }, 'Home');
      $(q, 'button', '', { onclick: () => router.navigateTo('/hacker') }, 'Hackers');
      $(q, 'button', '', { onclick: () => router.navigateTo('/validator/application') }, 'Validators');
      $(q, 'button', '', { onclick: () => router.navigateTo('/client') }, 'Organizations');

      this.buttonContainer = $(q, 'span', '', {}, (q) => {});
    });
    this.renderButtons();
  }

  private renderButtons(): void {
    CACHE_STORE.getUser()
      .get()
      .then((user) => {
        this.userType.innerHTML = user.type ?? '';
        // console.log(user);
        // @ts-ignore
        this.buttonContainer.innerHTML = '';
        if (user.type != 'Guest') {
          new Button({
            label: 'Sign Out',
            onClick: () => {
              CACHE_STORE.getUser().signOut();
              router.navigateTo('/');
              this.renderButtons();
            },
          }).render(this.buttonContainer);
          new Button({
            label: 'Profile',
            onClick: () => {
              router.navigateTo('/profile');
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

          new Button({
            label: 'Admin Sign In',
            onClick: () => {
              router.navigateTo('/adminLogin');
              this.renderButtons();
            },
          }).render(this.buttonContainer);
        }
      });
  }
}

const HomeRouteHandler = new RouteHandler('/', [homeViewHandler], undefined, false, false, true);

const LoginRouteHandler = new RouteHandler('/login', [loginViewHandler], undefined, true, true);
const AdminLoginRouteHandler = new RouteHandler('/adminLogin', [adminLoginViewHandler], undefined, true, true);
const RegisterRouteHandler = new RouteHandler('/register', [registerViewHandler], undefined, true);

const LandingRouteHandlers = new RouteHandler('/', [validatorLandingPageViewHandler, clientLandingPageViewHandler, hackerLandingPageViewHandler], undefined, false, false);

const ValidatorApplicationRouteHandler = new RouteHandler('/validator/application', [validatorApplicationViewHandler], undefined, false, false, false, false);

const CommonRouteHandlers = new RouteHandler(
  '/',
  [projectsViewHandler, reportsViewHandler, discussionViewHandler, userDashboardViewHandler],
  new SidebarView('/', HomeSidebar),
  false,
  false,
  false,
  true
);

const ValidatorRouteHandlers = new RouteHandler('/validator', [], new SidebarView('/', HomeSidebar), false, false, false, true);

const HackerRouteHandlers = new RouteHandler('/hacker', [vulnReportViewHandler], new SidebarView('/', HomeSidebar), false, false, false, true);

const ClientRouteHandlers = new RouteHandler('/client', [projectRequestFormViewHandler, clientHackerInvitationsViewHandler], new SidebarView('/', HomeSidebar), false, false, false, true);

const ProjectLeadRouteHandlers = new RouteHandler('/lead', [vulnReportViewHandler], new SidebarView('/', HomeSidebar), false, false, false, true);

const AdminRouteHandlers = new RouteHandler(
  '/admin',
  [adminDashboardViewHandler, validatorApplicationsViewHandler, listValidatorsViewHandler, listUsersViewHandler, adminProjectsViewHandler],
  new SidebarView('/', AdminSidebar),
  false,
  false,
  false,
  false
);

const TestRouteHandlers = new RouteHandler('/test', [styleGuideViewHandler], new SidebarView('/', HomeSidebar), false, false, false, true);

const ProjectRouteHandler = new RouteHandler('/projects', [projectDashboardViewHandler, verifyProjectHandler, projectConfigFormViewHandler], undefined, false, false, false, true);

const ReportRouteHandler = new RouteHandler('/reports', [vulnReportReviewViewHandler], undefined, false, false, false, true);

const UserViewHandlers = new RouteHandler('/profile', [profileViewHandler], undefined, false, false, false, true);

const DiscussionRouteHandler = new RouteHandler('/discussion', [discussionViewHandler], undefined, false, false, false, true);

router.setTopNavigationView(new TopNavigationView());

router.addRouteHandler(HomeRouteHandler);
router.addRouteHandler(RegisterRouteHandler);
router.addRouteHandler(LoginRouteHandler);
router.addRouteHandler(AdminLoginRouteHandler);
router.addRouteHandler(LandingRouteHandlers);
router.addRouteHandler(ValidatorApplicationRouteHandler);

router.addRouteHandler(CommonRouteHandlers);
router.addRouteHandler(TestRouteHandlers);

router.addRouteHandler(ValidatorRouteHandlers);
router.addRouteHandler(HackerRouteHandlers);
router.addRouteHandler(ClientRouteHandlers);
router.addRouteHandler(ProjectLeadRouteHandlers);
router.addRouteHandler(AdminRouteHandlers);

router.addRouteHandler(ProjectRouteHandler);
router.addRouteHandler(UserViewHandlers);
router.addRouteHandler(ReportRouteHandler)
