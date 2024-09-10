import { Quark } from '../../../ui_lib/quark';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { CACHE_STORE } from '../../../data/cache';
import { ProjectTeamCacheMock, ProjectTeam } from '../../../data/validator/cache/project.team';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
export default class Team {
  projectTeam: ProjectTeam = {} as ProjectTeam;
  constructor(private projectId: string) {
    this.projectId = projectId;
  }
  private readonly projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId) as ProjectTeamCacheMock;

  async loadProjectData(): Promise<void> {
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
    await this.loadProjectData();
    loading.hide();

    console.log('projectTeamCache', this.projectTeamCache);
    const projectLeadCollapsible = new CollapsibleBase('Project Lead', '');
    projectLeadCollapsible.render(q);

    const clientCollapsible = new CollapsibleBase('Client', '');
    clientCollapsible.render(q);

    const hackerCollapsible = new CollapsibleBase('Hacker', '');
    hackerCollapsible.render(q);
    const validatorCollapsible = new CollapsibleBase('Validator', '');
    validatorCollapsible.render(q);
  }
}
