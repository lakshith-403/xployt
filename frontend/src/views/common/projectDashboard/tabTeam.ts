import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { CollapsibleBase } from '@components/Collapsible/collap.base';
import { CACHE_STORE } from '@data/cache';
import { ProjectTeamCache, ProjectTeam } from '@data/common/cache/projectTeam.cache';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import './tabTeam.scss';
import { ButtonType } from '@/components/button/base';
import { IconButton } from '@/components/button/icon.button';
import { KickHackers } from './tabOverviewContent/leadComponents/kickHackers';
import { User, UserCache } from '@data/user';
import { UserType } from '@data/user';
import NETWORK from '@/data/network/network';
export default class Team {
  projectTeam: ProjectTeam = {} as ProjectTeam;
  private readonly projectTeamCache: ProjectTeamCache;
  private kickHackers!: KickHackers;
  private user!: User;
  private userCache: UserCache;
  private userRole!: UserType;
  private state!: string;

  constructor(private projectId: string) {
    this.projectId = projectId;
    this.projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId) as ProjectTeamCache;
    this.userCache = CACHE_STORE.getUser();
  }

  async loadData(): Promise<void> {
    try {
      this.projectTeam = await this.projectTeamCache.load(this.projectId);
      this.kickHackers = new KickHackers({ projectId: this.projectId });
      this.user = await this.userCache.get();
      this.userRole = this.user.type;
      const projectData = (await NETWORK.get(`/api/single-project/${this.projectId}?role=${this.userRole}`)).data.project;
      this.state = projectData.state;
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();

    await this.loadData();
    loading.hide();
    $(q, 'div', 'd-flex gap-2 mt-2', {}, (q) => {
      $(q, 'div', 'd-flex flex-column gap-2 align-items-center py-2 flex-2', {}, (q) => {
        console.log('project team', this.projectTeam);
        const clientCollapsible = new CollapsibleBase('Client', '');
        clientCollapsible.render(q);
        this.createDivsFromObject(this.projectTeam.getClientWithoutId(), clientCollapsible.getContent(), 1);

        const projectLeadCollapsible = new CollapsibleBase('Project Lead', '');
        projectLeadCollapsible.render(q);
        this.createDivsFromObject(this.projectTeam.getProjectLeadWithoutId(), projectLeadCollapsible.getContent(), 1);

        const hackerCollapsible = new CollapsibleBase('Hacker', '');
        hackerCollapsible.render(q);
        this.createDivsFromObject(this.convertCacheArrayToObject(this.projectTeam.getHackersWithoutId(), 'Hacker', 1), hackerCollapsible.getContent(), 1);

        const validatorCollapsible = new CollapsibleBase('Validator', '');
        validatorCollapsible.render(q);
        this.createDivsFromObject(this.convertCacheArrayToObject(this.projectTeam.getValidatorsWithoutId(), 'Validator', 1), validatorCollapsible.getContent(), 1);
      });
      if (this.userRole === 'ProjectLead') {
        $(q, 'div', 'd-flex flex-column gap-1 align-items-center py-2 w-100 border-left-1 p-2 flex-1', {}, (q) => {
          $(q, 'h2', 'd-flex gap-1 align-items-center', {}, (q) => {
            $(q, 'i', 'card-icon fa fa-plus-circle', {});
            $(q, 'span', '', {}, 'Actions');
          });
          if (this.state == 'Active') {
            new IconButton({
              type: ButtonType.PRIMARY,
              icon: 'fa-solid fa-plus',
              label: 'Remove Hackers',
              className: 'ml-3',
              onClick: () => {
                this.kickHackers.render(q);
              },
            }).render(q);
          } else {
            $(q, 'div', 'ml-3 bg-secondary rounded-3 p-2', {}, 'No Actions Available');
          }
        });
      }
    });
  }

  createDivsFromObject(obj: any, parent: Quark, depth: number): void {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        let value = obj[key];
        const div = $(parent, 'div', 'nested-div', {}, `${key} ${depth < 3 ? ':' : ''} ${typeof value === 'object' ? '' : value}`);

        if (Array.isArray(value)) {
          value = this.convertCacheArrayToObject(value, key, depth);
        }
        if (typeof value === 'object' && value !== null) {
          this.createDivsFromObject(value, div, depth + 1);
        }
      }
    }
    if (Object.keys(obj).length === 0) {
      $(parent, 'div', 'nested-div', {}, 'Not assigned yet');
    }
  }

  convertCacheArrayToObject(dataObject: any[], prefix: String, depth: number): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    dataObject.forEach((hacker, index) => {
      let key = '';
      if (depth < 2) {
        key = `${prefix}_${index + 1}`;
      }
      result[key] = hacker;
    });
    return result;
  }
}
