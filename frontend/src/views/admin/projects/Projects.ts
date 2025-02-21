import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import { CACHE_STORE } from '../../../data/cache';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { CustomTable } from '../../../components/table/customTable';
import { CheckboxManager } from '../../../components/checkboxManager/checkboxManager';
import { router } from '@/ui_lib/router';
import { BREADCRUMBS } from '@/components/breadCrumbs/breadCrumbs';
import NETWORK from '@data/network/network';
import { excludeFieldsFromObjects } from '@/ui_lib/utils';
export default class ProjectsView extends View {
  private userId: string | null = null;
  private projects: any[] = [];

  private static readonly FILTER_OPTIONS = ['Pending', 'Active', 'Unconfigured'];
  private static readonly FILTER_OPTIONS_2 = ['Rejected', 'Completed'];
  private get TABLE_HEADERS(): string[] {
    return ['ID', 'Title', 'Status', 'LeadId', 'ClientId', 'Pending Reports'];
  }

  constructor() {
    super();
  }

  private async loadProjects(): Promise<void> {
    try {
      const user = await CACHE_STORE.getUser().get();
      this.userId = user.id;
      const response = await NETWORK.get(`/api/new-project/admin`, { showLoading: true, handleError: true, throwError: true });
      this.projects = response.data.projects;
      console.log('projects', this.projects);
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  private renderProjectSection(q: Quark, title: string, projects: any[], filterOptions: string[]): void {
    const collapsible = new CollapsibleBase(title, '');
    collapsible.render(q);

    const table = new CustomTable({
      content: projects,
      headers: this.TABLE_HEADERS,
      className: 'table-projects mt-2',
      options: {
        filteredField: 'state',
        falseKeys: [],
        noDataMessage: 'No projects to show',
        callback: (project) => {
          BREADCRUMBS.addBreadcrumb({ label: 'Projects', link: '/admin/projects' });
          BREADCRUMBS.addBreadcrumb({ label: project.projectId.toString(), link: `/admin/projects/${project.projectId}` });
          router.navigateTo(`/admin/projects/${project.projectId}`);
        },
        orderIndices: [4, 3, 2, 5, 0, 1],
      },
    });

    $(collapsible.getContent(), 'div', 'filter-bar', {}, (q) => {
      $(q, 'span', 'filter-bar-title', {}, 'Filter:');
      const checkboxManager = new CheckboxManager(filterOptions, (checkboxValues) => {
        table.updateRows(checkboxValues);
      });
      checkboxManager.render(q);
    });
    table.render(collapsible.getContent());
  }

  async render(q: Quark): Promise<void> {
    await this.loadProjects();

    q.innerHTML = '';
    $(q, 'div', 'd-flex flex-column align-items-center container p-4', {}, (q) => {
      if (this.projects.length === 0) {
        $(q, 'div', 'table-row', {}, (q) => {
          $(q, 'span', 'table-cell last-cell', {}, 'No data available at the moment');
        });
      } else {
        const pendingProjects = this.projects.filter((project) => ['Active', 'Unconfigured', 'Pending'].includes(project.state));
        const completedProjects = this.projects.filter(({ state }) => ['Completed', 'Rejected'].includes(state));

        this.renderProjectSection(q, 'Ongoing Projects', pendingProjects, ProjectsView.FILTER_OPTIONS);
        this.renderProjectSection(q, 'Past Projects', completedProjects, ProjectsView.FILTER_OPTIONS_2);
      }
    });
  }
}

export const adminProjectsViewHandler = new ViewHandler('/projects', ProjectsView);
