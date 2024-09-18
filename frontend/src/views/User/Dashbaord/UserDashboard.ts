import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './Dashboard.scss';
import { UserCache } from '../../../data/user';
import { Invitation, InvitationsCache } from '../../../data/User/cache/invitations.cache';
import { Project, ProjectsCache } from '../../../data/validator/cache/projects.cache';
import { CACHE_STORE } from '../../../data/cache';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { ColoredFilterableTable } from '../../../components/table/colored.filterable.table';
import { CheckboxManager } from '../../../components/checkboxManager/checkboxManager';
import { ProjectTable } from '../../../components/table/projectsTable'; // Import ProjectTable

class DashboardView implements View {
  private params: { projectId: string };
  private userId: number | null = null;
  private userCache: UserCache;
  private invitationsCache: InvitationsCache;
  private projectsCache: ProjectsCache;
  private invitations: Invitation[] = [];
  private projects: Project[][] = [];

  private static readonly INVITATION_TABLE_HEADERS = ['Date', 'Description', 'Status'];
  private static readonly PROJECT_TABLE_HEADERS = ['ID', 'Status', 'Title', 'Client', 'Pending Reports'];
  private static readonly PROJECT_FILTER_OPTIONS = ['pending', 'closed', 'in progress'];

  constructor(params: { projectId: string }) {
    this.params = params;
    this.userCache = CACHE_STORE.getUser('1');
    this.invitationsCache = CACHE_STORE.getInvitations('1');
    this.projectsCache = CACHE_STORE.getProjects();
  }

  private async loadDashboardData(): Promise<void> {
    try {
      const user = await this.userCache.get();
      this.userId = user.id;

      // Load invitations and projects
      this.invitations = await this.invitationsCache.get(false, this.userId);
      this.projects = await this.projectsCache.get(false, this.userId);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  }

  // Render the invitations section
  private renderInvitationsTable(q: Quark): void {
    const collapsible = new CollapsibleBase('Invitations', '');
    collapsible.render(q);

     const invitationData = this.invitations.map(invitation => ({
    date: invitation.date,
    description: invitation.description,
    status: invitation.status
  }));
  
  const table = new ColoredFilterableTable(invitationData, DashboardView.INVITATION_TABLE_HEADERS, {}, 'status', '');

    $(collapsible.getContent(), 'div', 'filter-bar', {}, (q) => {
      $(q, 'span', 'filter-bar-title', {}, 'Filter by status:');
      const checkboxManager = new CheckboxManager(['Accepted', 'Pending', 'Declined'], (checkboxValues) => {
        table.updateRows(checkboxValues);
      });
      checkboxManager.render(q);
    });
    table.render(collapsible.getContent());
  }

  // Render the projects section
  private renderProjectSection(q: Quark, title: string, projects: Project[]): void {
    const collapsible = new CollapsibleBase(title, '');
    collapsible.render(q);

    const table = new ProjectTable(projects, DashboardView.PROJECT_TABLE_HEADERS, {}, 'status', '');

    $(collapsible.getContent(), 'div', 'filter-bar', {}, (q) => {
      $(q, 'span', 'filter-bar-title', {}, 'Filter:');
      const checkboxManager = new CheckboxManager(DashboardView.PROJECT_FILTER_OPTIONS, (checkboxValues) => {
        table.updateRows(checkboxValues);
      });
      checkboxManager.render(q);
    });
    table.render(collapsible.getContent());
  }

  private renderEarnings(q: Quark): void {
    $(q, 'div', 'earnings-section', {}, (q) => {
      $(q, 'div', 'earning-box', {}, (q) => {
        $(q, 'span', 'total-monthly-earnings', {}, 'Total monthly earnings:');
        $(q, 'h3', '', { innerText: '$548.00' });
      });
      $(q, 'div', 'earning-box', {}, (q) => {
        $(q, 'span', 'pending-earnings', {}, 'Pending earnings:');
        $(q, 'h3', '', { innerText: '$45.00' });
      });
      $(q, 'div', 'earning-box', {}, (q) => {
        $(q, 'span', 'total-project-earnings', {}, 'Total project earnings:');
        $(q, 'h3', '', { innerText: '$50.00' });
      });
    });
  }

  async render(q: Quark): Promise<void> {
    console.log('Rendering DashboardView');
    const loading = new LoadingScreen(q);
    loading.show();
    await this.loadDashboardData();
    loading.hide();

    $(q, 'div', 'dashboard projectLead', {}, (q) => {
      const pendingProjects = this.projects[0]!;

      this.renderEarnings(q);
      this.renderInvitationsTable(q);
      this.renderProjectSection(q, 'Pending Projects', pendingProjects);
    });
  }

  private async acceptInvitation(invitationId: number): Promise<void> {
    try {
      await this.invitationsCache.acceptInvitation(invitationId);
      alert('Invitation accepted');
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  }
}

export const dashboardViewHandler = new ViewHandler('dashboard', DashboardView);