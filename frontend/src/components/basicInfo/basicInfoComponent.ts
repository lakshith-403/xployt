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
  private assignedUserId: (string | undefined)[] = [];
  private assignedUserCache = new AssignedUserCache();

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

  async loadAssignedUser(): Promise<void> {
    try {
      const role = this.currentUser.type === 'Hacker' ? 'validator' : 'hacker';
      console.log("Trying to get assigned user for:");
      console.log(role)
      const assignedUser: AssignedUser[] = (await this.assignedUserCache.load(role, this.project.projectId.toString(), this.currentUser.id));
      this.assignedUserId = assignedUser.map(user => user.userId?.toString()) ?? [];
    } catch (error) {
      console.error('Failed to load assigned user:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    console.log(this.project.projectId, this.project.state);

    const loading = new LoadingScreen(q);
    loading.show();
    await this.loadCurrentUser();
    loading.hide();

    $(q, 'div', '', {id: 'basic-info'}, async (q) => {
      $(q, 'div', 'section-content', {}, async (q) => {
        $(q, 'div', '', {}, (q) => {
          $(q, 'span', '', {}, (q) => {
            $(q, 'p', 'key', {}, 'Client');
            $(q, 'p', 'value', {}, this.project.clientId);
          });
          $(q, 'span', '', {}, (q) => {
            $(q, 'p', 'key', {}, 'Access Link');
            $(q, 'a', 'key link', {href: '#', target: '_blank'}, (q) => {
              $(q, 'p', 'value', {}, 'www.example.com');
            });
          });
        });
        $(q, 'div', '', {}, (q) => {
          $(q, 'span', '', {}, (q) => {
            $(q, 'p', 'key', {}, 'Start Date');
            $(q, 'p', 'value', {}, this.project.startDate);
          });
          $(q, 'span', '', {}, (q) => {
            $(q, 'p', 'key', {}, 'End Date');
            $(q, 'p', 'value', {}, this.project.endDate);
          });
        });
        $(q, 'div', '', {}, async (q) => {
          if (this.currentUser.type !== 'ProjectLead') {
            await new UserCard(
              this.project.leadId,
              'lead',
              'card',
              'Project Lead',
              {
                highLightKeys: [ 'email' ],
                highlightClassName: 'text-light-green',
                showKeys: [ 'name', 'email' ],
                callback: () => {
                  router.navigateTo('/user-info/' + this.project.leadId);
                }
              }
            ).render(q);
          }

          console.error("Trying to get assigned user for:");
          console.log(this.currentUser.type);

          if ((this.currentUser.type === 'Hacker') || this.currentUser.type === 'Validator') {
            loading.show();
            console.log("Trying tp get assigned user for:" ,this.currentUser);
            await this.loadAssignedUser();
            loading.hide();

            for (const userId of this.assignedUserId) {

              if (userId) {
                await new UserCard(
                  userId,
                  this.currentUser.type === 'Hacker' ? 'validator' : 'hacker',
                  'card',
                  this.currentUser.type === 'Hacker' ? 'Assigned Validator' : 'Assigned Hacker',
                  {
                    highLightKeys: [ 'email' ],
                    highlightClassName: 'text-light-green',
                    showKeys: [ 'name', 'email' ],
                    callback: () => {
                      router.navigateTo('/user-info/' + userId);
                    }
                  }
                ).render(q);
              }
            }
          }
        });
      });
    });
  }
}