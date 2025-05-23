//styles
import './styles/styles.scss';
import './styles/X-bootstrap.scss';
import './styles/X-typography.scss';
import './styles/X-colors.scss';
import './styles/X-utils.scss';
//utils
import { Quark, QuarkFunction as $ } from './ui_lib/quark';
import { RouteHandler } from '@ui_lib/route';
import './ui_lib/router';
import { router } from '@ui_lib/router';
import { NavigationView } from '@ui_lib/view';

//components
import { SidebarTab, SidebarView } from '@components/SideBar/SideBar';
import { Button } from '@components/button/base';
import { convertToDom } from '@components/ModalManager/ModalManager';
import ModalManager from './components/ModalManager/ModalManager';
import { Notifications } from '@components/notifications/newNotifications';

//alerts
import alertOnlyOK from '@alerts/alertOnlyOK.html';
import alertForErrors from '@alerts/alertForErrors.html';
import alertOnlyCancel from '@alerts/alertOnlyCancel.html';

//cache
import { CACHE_STORE } from '@data/cache';

// Sidebars
import { HomeSidebar, AdminSidebar } from '@views/sideBars';

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
import { userProfileForAdminViewHandler, userProfileViewHandler } from '@views/UserProfile';
import { complaintFormViewHandler } from '@views/common/projectDashboard/complaintForm';
import { complaintViewHandler } from '@views/complaint';
import { vulnReportReviewViewHandler } from '@views/common/ReportReview/ReportReview';
import { editReportViewHandler } from '@views/hacker/VulnerabilityReport/EditReport';
import { adminReportsViewHandler } from '@views/admin/Report';
import { paymentViewHandler } from './views/common/payments';
import { privacyPolicyViewHandler } from '@views/policies/PrivacyPolicy';
import { userAgreementViewHandler } from '@views/policies/UserAgreement';
import { leadReportFormViewHandler } from '@views/projectLead/leadReport/leadReportForm';
import { signupViewHandler } from '@views/Signup';
import { clientSignUpViewHandler } from '@views/client/signUp';
import { passwordResetViewHandler } from '@views/PasswordReset';
import { hackerSignUpViewHandler } from '@views/hacker/hackerSignUp';
import { systemEarningsViewHandler } from '@views/admin/earnings/SystemEarnings';

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
  notificationContainer!: Quark;
  userType!: Quark;

  willUpdate: () => void = () => {};

  render(q: Quark): void {
    let parent = q;
    q.innerHTML = '';
    const logo = $(q, 'img', 'icon-image', { src: './../assets/xployt-logo.png' });
    logo.onclick = () => router.navigateTo('/');

    $(q, 'div', 'buttons', {}, (q) => {
      this.userType = $(q, 'span', 'user-type text-light-green', {}, '');
      this.notificationContainer = $(q, 'span', '', {}, (q) => {});
      $(q, 'button', '', { onclick: () => router.navigateTo('/') }, 'Home');

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
        this.notificationContainer.innerHTML = '';
        if (user.type != 'Guest') {
          new Notifications(this.notificationContainer, user.id).render();
          $(this.buttonContainer, 'button', '', { onclick: () => router.navigateTo(user.type === 'Admin' ? '/admin' : '/dashboard') }, 'Dashboard');
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
          $(this.buttonContainer, 'button', '', { onclick: () => router.navigateTo('/home/hacker') }, 'Hackers');
          $(this.buttonContainer, 'button', '', { onclick: () => router.navigateTo('/home/validator') }, 'Validators');
          $(this.buttonContainer, 'button', '', { onclick: () => router.navigateTo('/home/client') }, 'Organizations');
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

const LoginRouteHandler = new RouteHandler('/login', [loginViewHandler], undefined, true, true);
const PasswordResetRouteHandler = new RouteHandler('/reset-password', [passwordResetViewHandler], undefined, true, true);
const AdminLoginRouteHandler = new RouteHandler('/adminLogin', [adminLoginViewHandler], undefined, true, true);
const RegisterRouteHandler = new RouteHandler('/register', [registerViewHandler], undefined, true);
const NewSignupRouteHandler = new RouteHandler('/newsignup', [signupViewHandler], undefined, false);

const LandingRouteHandlers = new RouteHandler(
  '/home/',
  [validatorLandingPageViewHandler, clientLandingPageViewHandler, hackerLandingPageViewHandler, privacyPolicyViewHandler, userAgreementViewHandler],
  undefined,
  false,
  false,
  false
);

const ValidatorApplicationRouteHandler = new RouteHandler('/validator/application', [validatorApplicationViewHandler], undefined, false, false, false, false);

const CommonRouteHandlers = new RouteHandler(
  '/',
  [userProfileViewHandler, projectsViewHandler, reportsViewHandler, discussionViewHandler, userDashboardViewHandler, paymentViewHandler],
  new SidebarView('/', HomeSidebar),
  false,
  false,
  false,
  true
);

// const ValidatorRouteHandlers = new RouteHandler('/validator', [], new SidebarView('/', HomeSidebar), false, false, false, true);

const HackerRouteHandlers = new RouteHandler('/hacker', [vulnReportViewHandler, editReportViewHandler], new SidebarView('/', HomeSidebar), false, false, false, true);
const HackerRegisterRouteHandlers = new RouteHandler('/register', [hackerSignUpViewHandler, clientSignUpViewHandler], undefined, false, false, false, false);

const ClientRouteHandlers = new RouteHandler('/client', [projectRequestFormViewHandler, clientHackerInvitationsViewHandler], new SidebarView('/', HomeSidebar), false, false, false, true);

const ProjectLeadRouteHandlers = new RouteHandler('/lead', [], new SidebarView('/', HomeSidebar), false, false, false, true);
const ProjectLeadRouteHandlersWithSidebar = new RouteHandler('/lead', [leadReportFormViewHandler], undefined, false, false, false, true);

const AdminRouteHandlers = new RouteHandler(
  '/admin',
  [
    adminDashboardViewHandler,
    validatorApplicationsViewHandler,
    listValidatorsViewHandler,
    listUsersViewHandler,
    adminProjectsViewHandler,
    adminReportsViewHandler,
    userProfileForAdminViewHandler,
    systemEarningsViewHandler,
  ],
  new SidebarView('/', AdminSidebar),
  false,
  false,
  false,
  true,
  ['Admin']
);

const TestRouteHandlers = new RouteHandler('/test', [styleGuideViewHandler], new SidebarView('/', HomeSidebar), false, false, false, true);

const ProjectRouteHandler = new RouteHandler(
  '/projects',
  [projectDashboardViewHandler, verifyProjectHandler, projectConfigFormViewHandler, complaintFormViewHandler],
  undefined,
  false,
  false,
  false,
  true
);

const ReportRouteHandler = new RouteHandler('/reports', [vulnReportReviewViewHandler], undefined, false, false, false, true);

const UserViewHandlers = new RouteHandler('/profile', [profileViewHandler], undefined, false, false, false, true);

// const UserProfileViewHandler = new RouteHandler('/users', [], undefined, false, false, false, false);

const DiscussionRouteHandler = new RouteHandler('/discussion', [discussionViewHandler], undefined, false, false, false, true);

const ComplaintRouteHandler = new RouteHandler('/complaint/{complaintId}', [complaintViewHandler], undefined, false, false, false, true);

router.setTopNavigationView(new TopNavigationView());

router.addRouteHandler(HomeRouteHandler);
router.addRouteHandler(RegisterRouteHandler);
router.addRouteHandler(LoginRouteHandler);
router.addRouteHandler(PasswordResetRouteHandler);
router.addRouteHandler(AdminLoginRouteHandler);
router.addRouteHandler(NewSignupRouteHandler);
router.addRouteHandler(LandingRouteHandlers);
router.addRouteHandler(ValidatorApplicationRouteHandler);

router.addRouteHandler(CommonRouteHandlers);
router.addRouteHandler(TestRouteHandlers);

// router.addRouteHandler(ValidatorRouteHandlers);
router.addRouteHandler(HackerRouteHandlers);
router.addRouteHandler(ClientRouteHandlers);
router.addRouteHandler(ProjectLeadRouteHandlers);
router.addRouteHandler(AdminRouteHandlers);

router.addRouteHandler(ProjectRouteHandler);
router.addRouteHandler(UserViewHandlers);
// router.addRouteHandler(UserProfileViewHandler);
router.addRouteHandler(ReportRouteHandler);
router.addRouteHandler(ComplaintRouteHandler);
router.addRouteHandler(ProjectLeadRouteHandlersWithSidebar);
router.addRouteHandler(HackerRegisterRouteHandlers);
