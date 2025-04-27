import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { UIManager } from '@ui_lib/UIManager';
import { router } from '@ui_lib/router';
import { Button, ButtonType } from '@/components/button/base';
import { IconButton } from '@components/button/icon.button';
// import { OverviewPayments } from '@views/common/projectDashboard/tabOverviewContent/commonComponents/payments';
// import PieChart from '@/components/charts/pieChart';
import UserCard from '@components/UserCard';
import { UserType } from '@data/user';
import NETWORK from '@/data/network/network';
import { FormButton } from '@/components/button/form.button';
import { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertOnlyOK } from '@/main';
import modalManager from '@/components/ModalManager/ModalManager';

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

    $(q, 'div', 'd-flex flex-column gap-2', {}, (q) => {
      // User Card Section - for all states and roles
      $(q, 'div', 'p-2 d-flex align-items-center justify-content-center', {}, (q) => {
        const cardConfig = this.userRole === 'Client' ? { userId: this.projectInfo.leadId, type: 'lead' } : { userId: this.projectInfo.clientId, type: 'client' };

        new UserCard(cardConfig.userId, cardConfig.type, 'bg-secondary p-1 rounded-2 w-50', `${cardConfig.type.charAt(0).toUpperCase() + cardConfig.type.slice(1)} Info`, {
          highLightKeys: ['email'],
          highlightClassName: 'text-light-green',
          showKeys: ['name', 'email'],
          callback: () => {
            router.navigateTo(this.userRole === 'Admin' ? '/admin/user-info/' + cardConfig.userId : '/user-info/' + cardConfig.userId);
          },
        }).render(q);
      });

      // Project Configuration Section - for Unconfigured state and Client role
      if (this.projectInfo.state === 'Pending' && this.userRole === 'Client') {
        $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
          $(q, 'span', '', {}, 'Awaiting Project Lead Confirmation');
        });
      }

      // Project Configuration Section - for Unconfigured state and Client role
      if (['Closed', 'Review', 'Completed'].includes(this.projectInfo.state)) {
        $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
          switch (this.projectInfo.state) {
            case 'Closed':
              $(q, 'span', '', {}, 'This project has been closed');
              break;
            case 'Review':
              $(q, 'span', '', {}, 'This project is in review');
              break;
            case 'Completed':
              $(q, 'span', '', {}, 'This project has been completed');
              break;
          }
        });
      }

      if (this.projectInfo.state === 'Unconfigured' && this.userRole === 'Client') {
        new Button({
          label: 'Configure Project',
          onClick: () => {
            router.navigateTo(`/projects/${this.projectId}/configure/{false}`);
          },
        }).render(q);
      }

      // Project Update Section - for Configured state and Client role
      if (this.projectInfo.state === 'Configured' && this.userRole === 'Client') {
        new Button({
          label: 'Update Project Config',
          onClick: () => {
            router.navigateTo(`/projects/${this.projectId}/configure/{true}`);
          },
        }).render(q);
      }

      // Project Verification Section - for Pending state and ProjectLead role
      if (this.projectInfo.state === 'Pending' && this.userRole === 'ProjectLead') {
        $(q, 'div', 'd-flex align-items-center justify-content-center', {}, (q) => {
          new Button({
            label: 'Verify Project',
            onClick: () => {
              router.navigateTo(`/projects/${this.projectId}/verify`);
            },
          }).render(q);
        });
      }

      if (this.projectInfo.state === 'Unconfigured' && this.userRole === 'ProjectLead') {
        $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
          $(q, 'span', '', {}, 'Client yet to configure project');
        });
      }

      // Project Confirmation Section - for Configured state and ProjectLead role
      if (this.projectInfo.state === 'Configured' && this.userRole === 'ProjectLead') {
        $(q, 'div', 'd-flex align-items-center justify-content-center', {}, (q) => {
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

      // Basic Project Info Section - for all states and roles
      $(q, 'div', '', {}, (q) => {
        $(q, 'h2', 'sub-heading-2', {}, 'Project Info');
        UIManager.listObjectGivenKeys(q, this.projectInfo, ['startDate', 'endDate', 'description', 'technicalStack', 'state'], { className: 'd-flex flex-column gap-1' });
      });

      // Detailed Project Info Section - for Configured and Active states, ProjectLead and Client roles
      if (['Configured', 'Active', 'Review', 'Closed', 'Completed'].includes(this.projectInfo.state) && ['ProjectLead', 'Client', 'Admin', 'Validator'].includes(this.userRole)) {
        (async () => {
          UIManager.listArrayObjectValues(q, 'Scopes', this.detailedProjectInfoContainer.scopes, ['scopeName'], { className: 'd-flex flex-column gap-1' });

          const outOfScope = this.projectInfo.outOfScope || '';
          const outOfScopeArray = outOfScope.trim() ? outOfScope.split(',').filter((item: string) => item.trim()) : ['Not specified'];
          UIManager.listArrayValues(q, 'Out of Scope', outOfScopeArray, { className: 'd-flex flex-column gap-1' });

          const securityRequirements = this.projectInfo.securityRequirements || '';
          const securityRequirementsArray = securityRequirements.trim() ? securityRequirements.split(',').filter((item: string) => item.trim()) : ['Not specified'];
          UIManager.listArrayValues(q, 'Security Requirements', securityRequirementsArray, { className: 'd-flex flex-column gap-1' });

          $(q, 'div', '', {}, (q) => {
            $(q, 'h2', 'sub-heading-2', {}, 'Team Allocation');
            UIManager.listObjectGivenKeys(q, this.projectInfo, ['noOfValidators', 'noOfHackers'], { className: 'd-flex flex-column gap-1' });
          });
        })();
      }

      // Hacker Invitations Section - for Active state and Client role
      if (['Active', 'Review', 'Completed', 'Closed'].includes(this.projectInfo.state) && this.userRole === 'Client') {
        $(q, 'section', '', { id: 'reports' }, (q) => {
          $(q, 'span', '', {}, (q) => {
            $(q, 'h2', '', {}, 'Hacker Invitations');
            const button = new IconButton({
              icon: 'fa fa-plus',
              label: 'Invite-Hackers',
              // disabled: this.projectInfo.state !== 'Active',
              className: this.projectInfo.state !== 'Active' ? 'cursor-not-allowed' : '',
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
      }

      if (['Active', 'Unconfigured', 'Configured'].includes(this.projectInfo.state) && this.userRole === 'ProjectLead') {
        $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center gap-2  justify-content-center', {}, (q) => {
          $(q, 'span', 'col-6 text-center', {}, 'Close Project');
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
  }
}
