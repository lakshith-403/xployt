import {QuarkFunction as $, Quark} from '@ui_lib/quark';
import {View, ViewHandler} from '@ui_lib/view';
import {ProjectInfo, ProjectInfoCache, ProjectInfoCacheMock} from "@data/validator/cache/projectInfo";
import {CACHE_STORE} from "@data/cache";
// import {ProjectTeam, ProjectTeamCacheMock} from "@data/validator/cache/project.team";
import {Card} from "@components/card/card.base";
import '../tabOverview.scss'
import {ProjectTeamCache, ProjectTeam} from "@data/common/cache/projectTeam.cache";

export default class Client extends View {
  private projectId: string;
  private projectInfo: ProjectInfo | {} = {}
  private projectTeam: ProjectTeam | {} = {};
  private projectInfoCache: ProjectInfoCacheMock;
  private projectTeamCache: ProjectTeamCache;

  constructor(projectId: string) {
    super();
    this.projectId = projectId;
    this.projectInfoCache = CACHE_STORE.getProjectInfo(this.projectId);
    this.projectTeamCache = CACHE_STORE.getProjectTeam(this.projectId);
  }

  async loadProjectInfo(): Promise<void> {
    try {
      this.projectInfo = await this.projectInfoCache.get(false, this.projectId) as ProjectInfo;
      this.projectTeam = await this.projectTeamCache.get(false, this.projectId) as ProjectTeam;
      console.log("Team:", this.projectTeam)
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }


  async render(q: Quark): Promise<void> {
    await this.loadProjectInfo();
    $(q, 'div', 'invite-hackers', {}, (q) => {
      $(q, 'div', 'section-content', {}, (q) => {
        $(q, 'h1', '', {}, 'Project Dashboard')
        $(q, 'div', '', {}, (q) => {
          $(q, 'span', '', {}, (q) => {
            $(q, 'p', 'key', {}, 'Client');
            $(q, 'p', 'value', {}, "Client");
          });
          $(q, 'span', '', {}, (q) => {
            $(q, 'p', 'key', {}, 'Access Link');
            $(q, 'a', 'key link', {href: '#', target: '_blank'}, 'www.example.com');
          });
        });
        $(q, 'div', '', {}, (q) => {
          Object.entries(this.projectTeam).forEach(([key, teamMember]) => {
            const title = convertToTitleCase(key);

            new Card({
              title: title,
              content: $(q, 'div', 'description', {}, (q) => {
                $(q, 'span', '', {}, (q) => {
                  $(q, 'p', 'value', {}, teamMember.name);
                  $(q, 'p', 'value caption', {}, teamMember.username);
                });
                $(q, 'p', 'value link', {}, teamMember.email);
              }),
            }).render(q);
          });
        });
      });
    });
  }
}

function convertToTitleCase(input: string): string {
  const words = input.replace(/([A-Z])/g, ' $1').trim();
  return words.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

// export const inviteHackersViewHandler = new ViewHandler('invite-hackers', InviteHackers);
