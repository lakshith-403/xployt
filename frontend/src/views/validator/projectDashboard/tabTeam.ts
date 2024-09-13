import { Quark, QuarkFunction as $ } from '../../../ui_lib/quark';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { CACHE_STORE } from '../../../data/cache';
import { ProjectTeamCacheMock, ProjectTeam } from '../../../data/validator/cache/project.team';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import './tabTeam.scss';
export default class Team {
  projectTeam: ProjectTeam = {} as ProjectTeam;
  constructor(private projectId: string) {
    this.projectId = projectId;
  }
  private readonly projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId) as ProjectTeamCacheMock;

  async loadData(): Promise<void> {
    try {
      this.projectTeam = await this.projectTeamCache.get(false, this.projectId);
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

    console.log('projectTeamCache', this.projectTeamCache);
    const projectLeadCollapsible = new CollapsibleBase('Project Lead', '');
    projectLeadCollapsible.render(q);
    this.createDivsFromObject(this.projectTeam.projectLead, projectLeadCollapsible.getContent(), 1);

    const clientCollapsible = new CollapsibleBase('Client', '');
    clientCollapsible.render(q);
    this.createDivsFromObject(this.projectTeam.client, clientCollapsible.getContent(), 1);

    const hackerCollapsible = new CollapsibleBase('Hacker', '');
    hackerCollapsible.render(q);
    this.createDivsFromObject(this.convertCacheArrayToObject(this.projectTeam.hackers, 'Hacker', 1), hackerCollapsible.getContent(), 1);

    const validatorCollapsible = new CollapsibleBase('Validator', '');
    validatorCollapsible.render(q);
    this.createDivsFromObject(this.convertCacheArrayToObject(this.projectTeam.validator, 'Validator', 1), validatorCollapsible.getContent(), 1);
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
