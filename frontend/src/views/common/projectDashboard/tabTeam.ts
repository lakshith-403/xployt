import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { CollapsibleBase } from '@components/Collapsible/collap.base';
import { CACHE_STORE } from '@data/cache';
import { ProjectTeamCache, ProjectTeam } from '@data/common/cache/projectTeam.cache';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import './tabTeam.scss';

export default class Team {
  projectTeam: ProjectTeam = {} as ProjectTeam;
  private readonly projectTeamCache: ProjectTeamCache;

  constructor(private projectId: string) {
    this.projectId = projectId;
    this.projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId) as ProjectTeamCache;
  }

  async loadData(): Promise<void> {
    try {
      this.projectTeam = await this.projectTeamCache.load(this.projectId);
      console.log('projectTeam', this.projectTeam);
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();

    await this.loadData();
    loading.hide();
    $(q, 'div', 'd-flex flex-column gap-2 align-items-center py-2', {}, (q) => {
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
