import { router } from '@ui_lib/router';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { CACHE_STORE } from '@data/cache';
import { Project, ProjectCache } from '@data/common/cache/project.cache';
import { User } from '@data/user';
import { IconButton } from '@components/button/icon.button';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import { OverviewPayments } from '@views/common/projectDashboard/tabOverviewContent/commonComponents/payments';
import { OverviewReports } from '@views/common/projectDashboard/tabOverviewContent/hackerComponents/reports';
import BasicInfoComponent from '@components/basicInfo/basicInfoComponent';
import modalManager from '@/components/ModalManager/ModalManager';
import { modalAlertOnlyOK } from '@/main';
import { setContent } from '@/components/ModalManager/ModalManager';
import '../tabOverview.scss';
import { UIManager } from '@ui_lib/UIManager';
import { AssignedUserCache } from '@data/common/cache/projectTeam.cache';
import UserCard from '@components/UserCard';
import NETWORK from '@/data/network/network';

export default class Hacker {
  project: Project = {} as Project;
  private readonly projectCache = CACHE_STORE.getProject(this.projectId) as ProjectCache;
  private currentUser!: User;
  private assignedUserId: string = '';
  private assignedUserCache = new AssignedUserCache();
  private hackerReportStatus: any;

  constructor(private readonly projectId: string) {
    this.projectId = projectId;
  }

  async loadData(): Promise<void> {
    try {
      this.project = await this.projectCache.get(false, this.projectId);
      this.currentUser = await CACHE_STORE.getUser().get();
      const assignedUser = await this.assignedUserCache.load('validator', this.project.projectId.toString(), this.currentUser.id);
      this.assignedUserId = assignedUser.id?.toString() ?? '';
      console.log('Hacker: Project Info', this.project);
      const response = await NETWORK.get(`/api/hacker/reportStatus/${this.projectId}/${this.currentUser.id}`, {
        localLoading: true,
        elementId: 'action-buttons',
      });
      this.hackerReportStatus = response.data.hackerInfo.status;
      console.log('Hacker: Report Status', this.hackerReportStatus);
    } catch (error) {
      console.error('Failed to load project data', error);
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
              $(q, 'div', '', { id: 'basic-info' }, (q) => {
                // new BasicInfoComponent(this.project).render(q);
                $(q, 'div', 'card-content', {}, (q) => {
                  UIManager.listObjectGivenKeys(q, this.project, ['startDate', 'endDate', 'description', 'technicalStack', 'state'], {
                    className: 'info-list',
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
                    className: this.project.state !== 'Active' || this.hackerReportStatus === 'Kicked' ? 'cursor-not-allowed disabled' : '',
                    onClick: () => {
                      if (this.project.state === 'Active' && this.hackerReportStatus !== 'Kicked') {
                        const url = '/hacker/new-report/' + this.projectId;
                        router.navigateTo(url);
                      } else {
                        setContent(modalAlertOnlyOK, {
                          '.modal-title': 'Alert',
                          '.modal-message':
                            this.hackerReportStatus === 'Kicked'
                              ? 'You are not allowed to create reports because you have been removed from the project'
                              : 'You can only create reports for active projects',
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
            $(q, 'div', 'user-card-container', {}, (q) => {
              if (this.project.leadId) {
                new UserCard(this.project.leadId, 'lead', 'card', 'Project Lead', {
                  highLightKeys: ['email'],
                  highlightClassName: 'text-light-green',
                  showKeys: ['name', 'email'],
                  callback: () => {
                    router.navigateTo('/user-info/' + this.project.leadId);
                  },
                }).render(q);
              }
              if (this.assignedUserId) {
                new UserCard(this.assignedUserId, 'validator', 'card', 'Validator', {
                  highLightKeys: ['email'],
                  highlightClassName: 'text-light-green',
                  showKeys: ['name', 'email'],
                  callback: () => {
                    router.navigateTo('/user-info/' + this.project.leadId);
                  },
                }).render(q);
              }
            });
          });

          // Payments Card
          $(q, 'div', 'dashboard-card payments-card', {}, (q) => {
            $(q, 'h2', 'card-title', {}, (q) => {
              $(q, 'i', 'card-icon fa fa-money-bill-wave', {});
              $(q, 'span', '', {}, 'Payments');
            });

            $(q, 'div', 'card-content', {}, (q) => {
              new OverviewPayments(this.projectId, 'Hacker', this.currentUser.id).render(q);
            });
          });
        });
      });
    });
  }
}
