import { Quark, QuarkFunction as $ } from '../../../ui_lib/quark';
import { CACHE_STORE } from '../../../data/cache';
import { ProjectInfoCacheMock, ProjectInfo } from '../../../data/validator/cache/projectInfo';
import { ProjectTeamCacheMock, ProjectTeam } from '../../../data/validator/cache/project.team';
import LoadingScreen from '../../../components/loadingScreen/loadingScreen';
import {Card} from "../../../components/card/card.base";
import  './tabOverview.scss'

export default class Overview {
  projectInfo: ProjectInfo = {} as ProjectInfo
  projectTeam: {
    projectLead: {
      name: string;
      id: number;
      username: string;
      email: string;
    };
    assignedValidator: {
      name: string;
      id: number;
      username: string;
      email: string;
    };
  } = {
    projectLead: {
      name: '',
      id: 0,
      username: '',
      email: ''
    },
    assignedValidator: {
      name: '',
      id: 0,
      username: '',
      email: ''
    }
  }
  constructor(private readonly projectId: string) {
    this.projectId = projectId;
  }
  private readonly  projectInfoCache = CACHE_STORE.getProjectInfo(this.projectId) as ProjectInfoCacheMock
  private readonly projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId) as ProjectTeamCacheMock;

  async loadData(): Promise<void> {
    try {
      this.projectInfo = await this.projectInfoCache.get(false, this.projectId)
      const fullTeam = await this.projectTeamCache.get(true, this.projectId);
      this.projectTeam.projectLead = fullTeam.projectLead;
      this.projectTeam.assignedValidator = fullTeam.validator[0]
      console.log('Project Info', this.projectInfo)
      console.log("Project Team", this.projectTeam)
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
            $(q, 'a', 'key link', {href: '#', target: '_blank'}, 'www.example.com')
          })
        })
        $(q, 'div', '', {}, (q) => {
          Object.entries(this.projectTeam).forEach(([key, teamMember]) => {
            const title = convertToTitleCase(key);

            new Card({
              title: title,
              content: $(q, 'div', 'description', {}, (q) => {
                $(q, 'span', '', {}, (q) => {
                  $(q, 'p', 'value', {}, teamMember.name);
                  $(q, 'p', 'value caption', {}, teamMember.username);
                })
                $(q, 'p', 'value link', {}, teamMember.email);
              })
            }).render(q);
          });
        })
      })

      $(q, 'section', '', {}, (q) => {
        $(q, 'h2', '', {}, 'Rules and Scope')
        $(q, 'ul', '', {}, (q) => {
            this.projectInfo.scope.forEach((rule) => {
                $(q, 'li', '', {}, rule)
            })
        })
      })
    })
  }
}

function convertToTitleCase(input: string): string {
  const words = input.replace(/([A-Z])/g, ' $1').trim();
  return words.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}
