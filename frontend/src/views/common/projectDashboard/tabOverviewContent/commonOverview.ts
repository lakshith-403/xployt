import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { UIManager } from '@ui_lib/UIManager';
import { router } from '@ui_lib/router';
import { Button, ButtonType } from '@/components/button/base';
import { IconButton } from '@components/button/icon.button';
import UserCard from '@components/UserCard';
import { UserType } from '@data/user';
import NETWORK from '@/data/network/network';
import { FormButton } from '@/components/button/form.button';
import { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertOnlyOK } from '@/main';
import modalManager from '@/components/ModalManager/ModalManager';
import '../tabOverview.scss';

export default class CommonOverview {
  private projectInfo: any;
  private detailedProjectInfoContainer: any;

  constructor(private readonly projectId: string, private readonly userRole: UserType, public readonly rerender: () => void) {}

  private async loadData(): Promise<void> {
    try {
      const response = await NETWORK.get(`/api/single-project/${this.projectId}?role=${this.userRole}`);
      this.projectInfo = response.data.project;
      const detailedResponse = await NETWORK.get(`/api/project/fetch/${this.projectId}`);
      this.detailedProjectInfoContainer = detailedResponse.data;

      console.log('Project Info', this.projectInfo);
    } catch (error) {
      console.error('Failed to load project data', error);
    }
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();

    $(q, 'div', 'project-dashboard', {}, (q) => {
      $(q, 'div', 'dashboard-content', {}, (q) => {
        $(q, 'div', 'dashboard-column project-details', {}, (q) => {
          $(q, 'div', 'dashboard-card project-info-card', {}, (q) => {
            $(q, 'h2', 'card-title', {}, (q) => {
              $(q, 'i', 'fa fa-info-circle card-icon', {});
              $(q, 'span', '', {}, 'Project Information');
            });

            $(q, 'div', 'card-content', {}, (q) => {
              $(q, 'span', 'project-link text-light-green font-underline', {}, this.projectInfo.url);
              UIManager.listObjectGivenKeys(q, this.projectInfo, ['startDate', 'endDate', 'technicalStack', 'state'], {
                className: 'info-list',
              });
            });
          });

          $(q, 'hr', 'section-divider', {});

          // Detailed Project Info Section - for Configured and Active states, ProjectLead and Client roles
          if (['Configured', 'Active', 'Review', 'Closed', 'Completed'].includes(this.projectInfo.state) && ['ProjectLead', 'Client', 'Admin', 'Validator'].includes(this.userRole)) {
            (async () => {
              // Scopes Card
              $(q, 'div', 'dashboard-card scopes-card', {}, (q) => {
                $(q, 'h2', 'card-title', {}, (q) => {
                  $(q, 'i', 'fa fa-list card-icon', {});
                  $(q, 'span', '', {}, 'Project Scopes');
                });

                $(q, 'div', 'card-content', {}, (q) => {
                  UIManager.listArrayObjectValues(q, '', this.detailedProjectInfoContainer.scopes, ['scopeName'], {
                    className: 'scope-list',
                  });
                });
              });

              // Out of Scope Card
              $(q, 'div', 'dashboard-card out-of-scope-card', {}, (q) => {
                $(q, 'h2', 'card-title', {}, (q) => {
                  $(q, 'i', 'fa fa-ban card-icon', {});
                  $(q, 'span', '', {}, 'Out of Scope');
                });

                $(q, 'div', 'card-content', {}, (q) => {
                  const outOfScope = this.projectInfo.outOfScope || '';
                  const outOfScopeArray = outOfScope.trim() ? outOfScope.split(',').filter((item: string) => item.trim()) : ['Not specified'];
                  UIManager.listArrayValues(q, '', outOfScopeArray, {
                    className: 'out-of-scope-list',
                  });
                });
              });

              // Security Requirements Card
              $(q, 'div', 'dashboard-card security-card', {}, (q) => {
                $(q, 'h2', 'card-title', {}, (q) => {
                  $(q, 'i', 'card-icon fa fa-shield-alt', {});
                  $(q, 'span', '', {}, 'Security Requirements');
                });

                $(q, 'div', 'card-content', {}, (q) => {
                  const securityRequirements = this.projectInfo.securityRequirements || '';
                  const securityRequirementsArray = securityRequirements.trim() ? securityRequirements.split(',').filter((item: string) => item.trim()) : ['Not specified'];
                  UIManager.listArrayValues(q, '', securityRequirementsArray, {
                    className: 'security-list',
                  });
                });
              });

              $(q, 'hr', 'section-divider', {});

              // Team Allocation Card
              $(q, 'div', 'dashboard-card team-card', {}, (q) => {
                $(q, 'h2', 'card-title', {}, (q) => {
                  $(q, 'i', 'card-icon fa fa-users', {});
                  $(q, 'span', '', {}, 'Team Allocation');
                });

                $(q, 'div', 'card-content', {}, (q) => {
                  UIManager.listObjectGivenKeys(q, this.projectInfo, ['noOfValidators', 'noOfHackers'], {
                    className: 'team-list',
                  });
                });
              });
            })();
          }
        });

        // Right Column - Actions and User Info
        $(q, 'div', 'dashboard-column actions-column', {}, (q) => {
          // User Card Section
          $(q, 'div', 'dashboard-card user-card-container', {}, (q) => {
            const cardConfig = this.userRole === 'Client' ? { userId: this.projectInfo.leadId, type: 'lead' } : { userId: this.projectInfo.clientId, type: 'client' };

            $(q, 'h2', 'card-title', {}, (q) => {
              $(q, 'i', 'card-icon fa fa-user', {});
              $(q, 'span', '', {}, `Team Details`);
            });

            $(q, 'div', 'user-card-wrapper', {}, (q) => {
              new UserCard(cardConfig.userId, cardConfig.type, '', `${this.userRole === 'Client' ? 'Project Lead' : 'Client'}`, {
                highLightKeys: ['email'],
                highlightClassName: 'text-highlight',
                showKeys: ['name', 'email'],
                callback: () => {
                  router.navigateTo(this.userRole === 'Admin' ? '/admin/user-info/' + cardConfig.userId : '/user-info/' + cardConfig.userId);
                },
              }).render(q);
            });
          });

          // Action Cards based on state and role
          $(q, 'div', 'dashboard-card action-card', {}, (q) => {
            // $(q, 'h2', 'card-title', {}, (q) => {
            //   $(q, 'i', 'card-icon fa fa-cogs', {});
            //   $(q, 'span', '', {}, 'Actions');
            // });

            $(q, 'div', 'card-content', {}, (q) => {
              // Status Messages
              if (this.projectInfo.state === 'Pending' && this.userRole === 'Client') {
                $(q, 'div', 'status-message waiting', {}, (q) => {
                  $(q, 'i', 'fa fa-clock', {});
                  $(q, 'span', '', {}, 'Awaiting Project Lead Confirmation');
                });
              }

              if (['Closed', 'Review', 'Completed'].includes(this.projectInfo.state)) {
                $(q, 'div', `status-message ${this.projectInfo.state.toLowerCase()}`, {}, (q) => {
                  let icon = 'fa fa-check-circle';
                  let message = '';

                  switch (this.projectInfo.state) {
                    case 'Closed':
                      icon = 'fa fa-times-circle';
                      message = 'This project has been closed';
                      break;
                    case 'Review':
                      icon = 'fa fa-search';
                      message = 'This project is in review';
                      break;
                    case 'Completed':
                      icon = 'fa fa-check-circle';
                      message = 'This project has been completed';
                      break;
                  }

                  $(q, 'i', icon, {});
                  $(q, 'span', '', {}, message);
                });
              }

              if (this.projectInfo.state === 'Unconfigured' && this.userRole === 'ProjectLead') {
                $(q, 'div', 'status-message waiting', {}, (q) => {
                  $(q, 'i', 'fa fa-hourglass-half', {});
                  $(q, 'span', '', {}, 'Client yet to configure project');
                });
              }

              // Action Buttons
              $(q, 'div', 'action-buttons', {}, (q) => {
                $(q, 'h2', 'card-title', {}, (q) => {
                  $(q, 'i', 'card-icon fa fa-plus-circle', {});
                  $(q, 'span', '', {}, 'Actions');
                });
                // Configure Project Button for Client
                if (this.projectInfo.state === 'Unconfigured' && this.userRole === 'Client') {
                  $(q, 'div', 'action-button-container', {}, (q) => {
                    new Button({
                      label: 'Configure Project',
                      onClick: () => {
                        router.navigateTo(`/projects/${this.projectId}/configure/{false}`);
                      },
                    }).render(q);
                  });
                }

                // Update Config Button for Client
                if (this.projectInfo.state === 'Configured' && this.userRole === 'Client') {
                  $(q, 'div', 'action-button-container', {}, (q) => {
                    new Button({
                      label: 'Update Project Config',
                      onClick: () => {
                        router.navigateTo(`/projects/${this.projectId}/configure/{true}`);
                      },
                    }).render(q);
                  });
                }

                // Verify Project Button for Project Lead
                if (this.projectInfo.state === 'Pending' && this.userRole === 'ProjectLead') {
                  $(q, 'div', 'action-button-container', {}, (q) => {
                    new Button({
                      label: 'Verify Project',
                      onClick: () => {
                        router.navigateTo(`/projects/${this.projectId}/verify`);
                      },
                    }).render(q);
                  });
                }

                // Confirm Project Button for Project Lead
                if (this.projectInfo.state === 'Configured' && this.userRole === 'ProjectLead') {
                  $(q, 'div', 'action-button-container', {}, (q) => {
                    const button = new FormButton({
                      label: 'Confirm Project to proceed',
                      type: ButtonType.PRIMARY,
                      onClick: async () => {
                        await NETWORK.post(
                          `/api/lead/initiate/project/proceed/${this.projectId}`,
                          { projectLeadId: this.projectInfo.leadId },
                          {
                            showSuccess: true,
                            successCallback: () => {
                              window.location.reload();
                            },
                          }
                        );
                      },
                    });
                    button.render(q);
                  });
                }

                // Close Project Button for Project Lead
                if (this.projectInfo.state === 'Active' && this.userRole === 'ProjectLead') {
                  $(q, 'div', 'close-project-container', {}, (q) => {
                    // $(q, 'span', 'close-project-label', {}, 'Close Project');
                    new IconButton({
                      icon: 'fa fa-check',
                      label: 'Close Project',
                      type: ButtonType.TERTIARY,
                      onClick: () => {
                        setContent(modalAlertOnlyOK, {
                          '.modal-title': 'Warning',
                          '.modal-message': 'Are you sure you want to close the project? This action cannot be undone!',
                        });
                        modalManager
                          .show('alertOnlyOK', modalAlertOnlyOK, true)
                          .then(async () => {
                            try {
                              await NETWORK.delete(`/api/lead/project/${this.projectId}`, {
                                successCallback: () => {
                                  console.log('Project closed successfully');
                                  modalManager.hide('alertOnlyOK');
                                },
                              });
                            } catch (error) {
                              setContent(modalAlertOnlyOK, {
                                '.modal-title': 'Error',
                                '.modal-message': 'Failed to close project. Please try again.',
                              });
                              modalManager.show('alertOnlyOK', modalAlertOnlyOK);
                            }
                          })
                          .then(() => {
                            console.log('Project closed successfully and now showing modal');
                            setContent(modalAlertOnlyOK, {
                              '.modal-title': 'Alert',
                              '.modal-message': 'Project closed successfully',
                            });
                            modalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
                              NETWORK.invalidateCache(`/api/single-project/\\w+\\?role=ProjectLead`);
                              this.rerender();
                            });
                          });
                      },
                    }).render(q);
                  });
                }
              });
            });
          });

          // Hacker Invitations Section for Client role
          if (['Active', 'Review', 'Completed', 'Closed'].includes(this.projectInfo.state) && this.userRole === 'Client') {
            $(q, 'div', 'dashboard-card invite-hackers-card', {}, (q) => {
              $(q, 'h2', 'card-title', {}, (q) => {
                $(q, 'i', 'card-icon fa fa-user-plus', {});
                $(q, 'span', '', {}, 'Hacker Invitations');
              });

              $(q, 'div', 'card-content', {}, (q) => {
                $(q, 'div', 'invite-hackers-container', {}, (q) => {
                  new IconButton({
                    icon: 'fa fa-plus',
                    label: 'Invite Hackers',
                    className: this.projectInfo.state !== 'Active' ? 'invite-btn-disabled' : 'invite-btn',
                    onClick: () => {
                      if (this.projectInfo.state === 'Active') {
                        router.navigateTo(`/client/invite-hackers/${this.projectId}`);
                      } else {
                        setContent(modalAlertOnlyOK, {
                          '.modal-title': 'Alert',
                          '.modal-message': 'You can only invite hackers to active projects',
                        });
                        modalManager.show('alertOnlyOK', modalAlertOnlyOK, true);
                      }
                    },
                  }).render(q);
                });
              });
            });
          }
        });
      });
    });
  }
}
