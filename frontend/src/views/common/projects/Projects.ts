import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
// import './Projects.scss';
import { UserCache } from '../../../data/user';
import { CACHE_STORE } from '../../../data/cache';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { CustomTable } from '../../../components/table/customTable';
import { CheckboxManager } from '../../../components/checkboxManager/checkboxManager';
import { ButtonType } from '@/components/button/base';
import { FormButton } from '@/components/button/form.button';
import { router } from '@/ui_lib/router';
import NETWORK from '@/data/network/network';
import { excludeFieldsFromObjects } from '@/ui_lib/utils';
import { mapProjectStateToClass } from '@/styles/style.util';

export default class ProjectsView extends View {
  private params: { projectId: string };
  private userCache: UserCache;
  private user: any;
  private static readonly FILTER_OPTIONS = ['Pending', 'Active', 'Unconfigured', 'Configured', 'Closed', 'Review'];
  private static readonly FILTER_OPTIONS_2 = ['Rejected', 'Completed'];

  private projects: any[] = [];
  constructor(params: { projectId: string }) {
    super();
    this.params = params;
    this.userCache = CACHE_STORE.getUser();
  }

  private async loadProjects(): Promise<void> {
    try {
      const user = await this.userCache.get();
      this.user = user;
      const response = await NETWORK.get(`/api/new-project/${user.type}/${user.id}`);
      this.projects = user.type === 'Client' ? excludeFieldsFromObjects(response.data.projects, ['clientId']) : excludeFieldsFromObjects(response.data.projects, ['leadId']);
      console.log('projects', this.projects);
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  //map project state to css classes

  private renderProjectSection(q: Quark, title: string, projects: any[], filterOptions: string[]): void {
    const collapsible = new CollapsibleBase(title, '');
    collapsible.render(q);
    const TABLE_HEADERS = ['ID', 'Status', 'Title', this.user.type === 'Client' ? 'LeadId' : 'ClientId', 'Pending Reports'];
    const table = new CustomTable({
      content: projects,
      headers: TABLE_HEADERS,
      className: 'table-projects',
      options: {
        filteredField: 'state',
        cellClassName: 'cursor-pointer',
        cellClassNames: {
          1: mapProjectStateToClass,
          2: () => 'width-fit w-min-20',
        },
        falseKeys: [],
        noDataMessage: 'No projects to show',
        callback: (project) => {
          router.navigateTo(`/projects/${project.projectId}`);
        },
        orderKeys: ['projectId', 'state', 'title', this.user.type === 'Client' ? 'leadId' : 'clientId', 'pendingReports'],
      },
    });

    $(collapsible.getContent(), 'div', 'filter-bar py-1', {}, (q) => {
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
    $(q, 'div', 'd-flex flex-column container p-4 mt-8', {}, (q) => {
      // if (this.user.type === 'Client') {
      //   $(q, 'div', 'button-container d-flex justify-content-end container-md px-6 mb-3', {}, (q) => {
      //     const button = new FormButton({
      //       label: 'Add Project',
      //       onClick: () => router.navigateTo('/client/project-request'),
      //       type: ButtonType.PRIMARY,
      //     });
      //     button.render(q);
      //   });
      // }

      const pendingProjects = this.projects.filter((project) => ['Active', 'Unconfigured', 'Pending', 'Configured', 'Review', 'Closed'].includes(project.state));
      const completedProjects = this.projects.filter(({ state }) => ['Completed', 'Rejected'].includes(state));

      $(q, 'div', 'd-flex flex-column align-items-center', {}, (q) => {
        this.renderProjectSection(q, 'Ongoing Projects', pendingProjects, ProjectsView.FILTER_OPTIONS);
        this.renderProjectSection(q, 'Past Projects', completedProjects, ProjectsView.FILTER_OPTIONS_2);
      });
    });
  }
}

export const projectsViewHandler = new ViewHandler('projects', ProjectsView);
