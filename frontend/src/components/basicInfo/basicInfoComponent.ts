import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import './basicInfo.scss';
import { User } from "@data/user";
import { Project } from "@data/common/cache/project.cache";
import UserCard from "@components/UserCard";
import { AssignedUser, AssignedUserCache } from "@data/common/cache/projectTeam.cache";
import { CACHE_STORE } from "@data/cache";
import { router } from "@ui_lib/router";

export default class BasicInfoComponent {
  private currentUser: User = {} as User;
  private project: Project;

  constructor(project: Project) {
    this.project = project;
  }

  async loadCurrentUser(): Promise<void> {
    try {
      this.currentUser = await CACHE_STORE.getUser().get();
    } catch (error) {
      console.error('Failed to load current user:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    console.log(this.project.projectId, this.project.state);

    const loading = new LoadingScreen(q);
    loading.show();
    await this.loadCurrentUser();
    loading.hide();

    $(q, 'div', 'project-dashboard', {}, (q) => {
      $(q, 'div', 'dashboard-content', {}, (q) => {
        // Left Column - Project Information
        $(q, 'div', 'dashboard-column project-details', {}, (q) => {
          // Project Information Card
          $(q, 'div', 'dashboard-card project-info-card', {}, (q) => {
            $(q, 'h2', 'card-title', {}, (q) => {
              $(q, 'i', 'fa fa-info-circle card-icon', {});
              $(q, 'span', '', {}, 'Project Information');
            });

            $(q, 'div', 'date-content', {}, (q) => {
                $(q, 'span', '', {}, (q) => {
                  $(q, 'p', 'key', {}, 'Start Date');
                  $(q, 'p', 'value', {}, this.project.startDate);
                });
                $(q, 'span', '', {}, (q) => {
                  $(q, 'p', 'key', {}, 'End Date');
                  $(q, 'p', 'value', {}, this.project.endDate);
                });
            });
          });

          $(q, 'hr', 'section-divider', {});

          // Scope Card
          $(q, 'div', 'dashboard-card scopes-card', {}, (q) => {
            $(q, 'h2', 'card-title', {}, (q) => {
              $(q, 'i', 'fa fa-list card-icon', {});
              $(q, 'span', '', {}, 'Rules and Scope');
            });

            $(q, 'div', 'card-content', {}, (q) => {
              $(q, 'ul', 'scope-list', {}, (q) => {
                if (this.project.scope && this.project.scope.length > 0) {
                  this.project.scope.forEach((rule) => {
                    $(q, 'li', '', {}, rule);
                  });
                } else {
                  $(q, 'li', '', {}, 'No scope rules specified');
                }
              });
            });
          });
        });

        // Right Column - Lead and Assigned User Information
        $(q, 'div', 'dashboard-column actions-column', {}, (q) => {
          $(q, 'div', 'dashboard-card', {}, (q) => {
            $(q, 'h2', 'card-title', {}, (q) => {
              $(q, 'i', 'card-icon fa fa-user', {});
              $(q, 'span', '', {}, 'Team Details');
            });

            $(q, 'div', 'user-card-container', {}, async (q) => {
              if (this.project.leadId) {
                await new UserCard(
                  this.project.leadId,
                  'lead',
                  'card',
                  'Project Lead',
                  {
                    highLightKeys: ['email'],
                    highlightClassName: 'text-light-green',
                    showKeys: ['name', 'email'],
                    callback: () => {
                      router.navigateTo('/user-info/' + this.project.leadId);
                    },
                  }
                ).render(q);
              }
              if(this.project.clientId){
                await new UserCard(
                  this.project.clientId,
                  'client',
                  'card',
                  'Client',
                  {
                    highLightKeys: ['email'],
                    highlightClassName: 'text-light-green',
                    showKeys: ['name', 'email'],
                    callback: () => {
                      router.navigateTo('/user-info/' + this.project.clientId);
                    },
                  }
                ).render(q);
              }
            });
          });
        });
      });
    });
  }
}