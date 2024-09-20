import { Quark, QuarkFunction as $ } from '../../../ui_lib/quark';
import { CACHE_STORE } from '../../../data/cache';
import { ProjectInfoCacheMock, ProjectInfo } from '../../../data/validator/cache/projectInfo';
import { ProjectTeamCacheMock, ProjectTeam } from '../../../data/validator/cache/project.team';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import  './tabOverview.scss'

export default class Overview {
  projectInfo: ProjectInfo = {} as ProjectInfo
  projectTeam: ProjectTeam = {} as ProjectTeam;
  constructor(private readonly projectId: string) {
    this.projectId = projectId;
  }
  private readonly  projectInfoCache = CACHE_STORE.getProjectInfo(this.projectId) as ProjectInfoCacheMock
  private readonly projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId) as ProjectTeamCacheMock;

  async loadData(): Promise<void> {
    try {
      this.projectInfo = await this.projectInfoCache.get(false, this.projectId)
      this.projectTeam = await this.projectTeamCache.get(false, this.projectId);
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

    $(q,'div', 'project-info', {}, (q) => {

      $(q, 'p', '', {}, this.projectInfo.description)

      $(q, 'section', 'section', {id: 'basic-info'}, (q) => {
        $(q, 'div', '', {}, (q) => {
          $(q, 'span', '', {}, (q) => {
            $(q, 'p', 'key', {}, 'Client')
            $(q, 'p', 'value', {}, this.projectInfo.client)
          })
          $(q, 'span', '', {}, (q) => {
            $(q, 'p', 'key', {}, "Access Link")
            $(q, 'p', 'key link', {}, 'www.example.com')
          })
        })
        $(q, 'div', '', {}, (q) => {
          $(q, 'div', 'card', {}, (q) => {
            $(q, 'p', 'key', {}, 'Project Lead')
            $(q, 'span', 'description', {}, (q) => {
              $(q, 'p', 'value', {}, this.projectTeam.projectLead.name)
              $(q, 'p', 'value caption', {}, this.projectTeam.projectLead.name)
            })
            $(q, 'p', 'value link', {}, this.projectTeam.projectLead.contact)
          })
          $(q, 'div', 'card', {}, (q) => {
            $(q, 'p', 'key', {}, 'Assigned Validatorr')
            $(q, 'span', 'description', {}, (q) => {
              $(q, 'p', 'value', {}, this.projectTeam.validator[0].name)
              $(q, 'p', 'value caption', {}, this.projectTeam.validator[0].username)
            })
            $(q, 'p', 'value link description', {}, this.projectTeam.validator[0].email)
          })
        })

      })
    })
  }
}
