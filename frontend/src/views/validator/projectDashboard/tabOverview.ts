import { Quark, QuarkFunction as $ } from '../../../ui_lib/quark';
import { CACHE_STORE } from '../../../data/cache';
import { ProjectInfoCacheMock, ProjectInfo } from '../../../data/validator/cache/projectInfo';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import  './tabOverview.scss'

export default class Overview {
  projectInfo: ProjectInfo = {} as ProjectInfo;
  constructor(private projectId: string) {
    this.projectId = projectId;
  }
  private readonly  projectInfoCache = CACHE_STORE.getProjectInfo(this.projectId) as ProjectInfoCacheMock

  async loadData(): Promise<void> {
    try {
      this.projectInfo = await this.projectInfoCache.get(false, this.projectId)
      console.log('Project Info', this.projectInfo)
    }catch (error) {
      console.error('Failed to load project data', error);
    }
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();

    await this.loadData();
    loading.hide()

    $(q,'div', 'project-info', {}, 'Project Overview')
  }
}
