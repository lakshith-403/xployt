import { router } from '@ui_lib/router';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { CACHE_STORE } from '@data/cache';
import { Project, ProjectCache } from '@data/common/cache/project.cache';
import { User } from '@data/user';
import { IconButton } from '@components/button/icon.button';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import { OverviewPayments } from '@views/common/projectDashboard/tabOverviewContent/commonComponents/payments';
import { OverviewReports } from '@views/common/projectDashboard/tabOverviewContent/hackerComponents/reports';
import modalManager from '@/components/ModalManager/ModalManager';
import { modalAlertOnlyOK } from '@/main';
import { setContent } from '@/components/ModalManager/ModalManager';
import '../tabOverview.scss';
import { UIManager } from "@ui_lib/UIManager";
import { AssignedUser, AssignedUserCache } from "@data/common/cache/projectTeam.cache";
import UserCard from "@components/UserCard";

export default class Hacker {
  project: Project = {} as Project;
  private readonly projectCache = CACHE_STORE.getProject(this.projectId) as ProjectCache;
  private currentUser!: User;
  private assignedUserId: (string)[] = [];
  private assignedUserCache = new AssignedUserCache();


  constructor(private readonly projectId: string) {
    this.projectId = projectId;
  }

  async loadData(): Promise<void> {
    try {
      this.project = await this.projectCache.get(false, this.projectId);
      this.currentUser = await CACHE_STORE.getUser().get();
      console.log('Hacker: Project Info', this.project);
    } catch (error) {
      console.error('Failed to load project data', error);
    }
  }

  async loadAssignedUser(): Promise<void> {
    try {
      const role = this.currentUser.type === 'Hacker' ? 'validator' : 'hacker';
      const assignedUser: AssignedUser[] = await this.assignedUserCache.load(
        role,
        this.project.projectId.toString(),
        this.currentUser.id
      );
      this.assignedUserId = assignedUser.map(user => user.userId?.toString()).filter((id): id is string => id !== undefined);
      console.log("Assigned User Ids:", this.assignedUserId);
    } catch (error) {
      console.error('Failed to load assigned user:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();

    await this.loadData();
    loading.hide();

    $(q, 'div', 'project-dashboard', {}, (q) => {
      $(q, 'div', 'dashboard-content', {}, (q) => {
        // Left Column - Project Details, Scope, and Reports
        $(q, 'div', 'dashboard-column project-details', {}, (q) => {
          // Project Information Card
          $(q, 'div', 'dashboard-card project-info-card', {}, (q) => {
            $(q, 'h2', 'card-title', {}, (q) => {
              $(q, 'i', 'fa fa-info-circle card-icon', {});
              $(q, 'span', '', {}, 'Project Information');
            });

            $(q, 'div', 'card-content', {}, (q) => {
              $(q, 'div', '', {id: 'basic-info'}, (q) => {
                // new BasicInfoComponent(this.project).render(q);
                $(q, 'div', 'card-content', {}, (q) => {
                  $(q, 'a', 'project-link', {href: this.project.url, target: '_blank'}, this.project.url)
                  UIManager.listObjectGivenKeys(q, this.project, [ 'startDate', 'endDate', 'technicalStack', 'state' ], {
                    className: 'info-list'
                  });
                });
              });
            });
          });

          $(q, 'hr', 'section-divider', {});

          // Rules and Scope Card
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

          $(q, 'hr', 'section-divider', {});

          // Reports Table Card
          $(q, 'div', 'dashboard-card reports-card', {}, (q) => {
            $(q, 'h2', 'card-title', {}, (q) => {
              $(q, 'i', 'fa fa-bug card-icon', {});
              $(q, 'span', '', {}, 'Reports');
            });

            $(q, 'div', 'card-content', {}, (q) => {
              $(q, 'div', 'reports-table-container', {}, (q) => {
                new OverviewReports(this.projectId).render(q);
              });
            });
          });
        });

        // Right Column - User Cards, Create Report Button, and Payments
        $(q, 'div', 'dashboard-column actions-column', {}, (q) => {
          // Status Card (if needed based on project state)
          if (this.project.state !== 'Active') {
            $(q, 'div', 'dashboard-card action-card', {}, (q) => {
              $(q, 'div', 'card-content', {}, (q) => {
                $(q, 'div', `status-message ${this.project.state.toLowerCase()}`, {}, (q) => {
                  let icon = 'fa fa-check-circle';
                  let message = '';

                  switch (this.project.state) {
                    case 'Closed':
                      icon = 'fa fa-times-circle';
                      message = 'This project has been closed';
                      break;
                    // case 'Review':
                    //   icon = 'fa fa-search';
                    //   message = 'This project is in review';
                    //   break;
                    case 'Completed':
                      icon = 'fa fa-check-circle';
                      message = 'This project has been completed';
                      break;
                    default:
                      icon = 'fa fa-info-circle';
                      message = `Project is in ${this.project.state} state`;
                  }

                  $(q, 'i', icon, {});
                  $(q, 'span', '', {}, message);
                });
              });
            });
          }

          // Create Report Button Card
          $(q, 'div', 'dashboard-card action-card', {}, (q) => {
            $(q, 'h2', 'card-title', {}, (q) => {
              $(q, 'i', 'card-icon fa fa-plus-circle', {});
              $(q, 'span', '', {}, 'Actions');
            });

            $(q, 'div', 'card-content', {}, (q) => {
              $(q, 'div', 'action-buttons', {}, (q) => {
                $(q, 'div', 'action-button-container', {}, (q) => {
                  new IconButton({
                    icon: 'fa fa-plus',
                    label: 'Create Report',
                    className: this.project.state !== 'Active' ? 'cursor-not-allowed' : '',
                    onClick: () => {
                      if (this.project.state === 'Active') {
                        const url = '/hacker/new-report/' + this.projectId;
                        router.navigateTo(url);
                      } else {
                        setContent(modalAlertOnlyOK, {
                          '.modal-title': 'Alert',
                          '.modal-message': 'You can only create reports for active projects',
                        });
                        modalManager.show('alertOnlyOK', modalAlertOnlyOK, true);
                      }
                    },
                  }).render(q);
                });
              });
            });
          });

          // User Card (Project Lead)

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
                    highLightKeys: [ 'email' ],
                    highlightClassName: 'text-light-green',
                    showKeys: [ 'name', 'email' ],
                    callback: () => {
                      router.navigateTo('/user-info/' + this.project.leadId);
                    },
                  }
                ).render(q)
              }
              if ((this.currentUser.type === 'Hacker') || this.currentUser.type === 'Validator') {
                loading.show();
                console.log("Trying tp get assigned user for:", this.currentUser);
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

            // Payments Card
            if(this.currentUser.type == 'Hacker'){

              $(q, 'hr', 'section-divider', {});

              $(q, 'div', 'dashboard-card payments-card', {}, (q) => {
                $(q, 'h2', 'card-title', {}, (q) => {
                  $(q, 'i', 'card-icon fa fa-money-bill-wave', {});
                  $(q, 'span', '', {}, 'Payments');
                });

                $(q, 'div', 'card-content', {}, (q) => {
                  new OverviewPayments(this.projectId, 'Hacker', this.currentUser.id).render(q);
                });
              });
            }
          });
        });
      });
    });
  }
}