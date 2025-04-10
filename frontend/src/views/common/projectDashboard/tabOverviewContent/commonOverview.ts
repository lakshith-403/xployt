import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { UIManager } from '@ui_lib/UIManager';
import { router } from '@ui_lib/router';
import { Button, ButtonType } from '@/components/button/base';
import { IconButton } from '@components/button/icon.button';
import { OverviewPayments } from './clientComponents/payments';
import PieChart from '@/components/charts/pieChart';
import UserCard from '@components/UserCard';
import { UserType } from '@data/user';
import NETWORK from '@/data/network/network';
import { FormButton } from '@/components/button/form.button';

export default class CommonOverview {
  private projectInfo: any;
  private detailedProjectInfoContainer: any;

  constructor(private readonly projectId: string, private readonly userRole: UserType) {}

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
            router.navigateTo('/user-info/' + cardConfig.userId);
          },
        }).render(q);
      });

      // Project Configuration Section - for Unconfigured state and Client role
      if (this.projectInfo.state === 'Pending' && this.userRole === 'Client') {
        $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
          $(q, 'span', '', {}, 'Awaiting Project Lead Confirmation');
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

      // Project Confirmation Section - for Configured state and ProjectLead role
      if (this.projectInfo.state === 'Configured' && this.userRole === 'ProjectLead') {
        $(q, 'div', 'd-flex align-items-center justify-content-center', {}, (q) => {
          const button = new FormButton({
            label: 'Confirm Project to proceed',
            type: ButtonType.PRIMARY,
            onClick: async () => {
              await NETWORK.post(
                `/api/lead/initiate/project/proceed/${this.projectId}`,
                {},
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
        UIManager.listObjectGivenKeys(q, this.projectInfo, ['description', 'technicalStack', 'startDate', 'state'], { className: 'd-flex flex-column gap-1' });
      });

      // Detailed Project Info Section - for Configured and Active states, ProjectLead and Client roles
      if (['Configured', 'Active'].includes(this.projectInfo.state) && ['ProjectLead', 'Client'].includes(this.userRole)) {
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

      // Payments Section - for Active state and ProjectLead, Client, Admin roles
      if (this.projectInfo.state === 'Active' && ['ProjectLead', 'Client', 'Admin'].includes(this.userRole)) {
        $(q, 'div', '', { id: 'basic-info' }, (q) => {
          $(q, 'section', '', { id: 'payments' }, (q) => {
            $(q, 'div', '', {}, (q) => {
              $(q, 'h2', '', {}, 'Payments');
              new OverviewPayments(this.projectId, this.userRole).render(q);
            });
            // CHECK - Fix when data available
            // $(q, 'div', '', {}, (q) => {
            //   const pieChartOptions = {
            //     data: {
            //       'Pending Payments': 30000,
            //       Paid: 20000,
            //       Remaining: 30000,
            //       'On Hold': 40000,
            //     },
            //     title: '',
            //     subtitle: '',
            //     colorScheme: 'greenTheme' as 'greenTheme',
            //   };

            //   $(q, 'div', '', {}, (q) => {
            //     $(q, 'h2', '', {}, 'Payments Distribution');
            //     const pieChart = new PieChart(pieChartOptions);
            //     pieChart.render(q);
            //   });
            // });
          });
        });
      }

      // Hacker Invitations Section - for Active state and Client role
      if (this.projectInfo.state === 'Active' && this.userRole === 'Client') {
        $(q, 'section', '', { id: 'reports' }, (q) => {
          $(q, 'span', '', {}, (q) => {
            $(q, 'h2', '', {}, 'Hacker Invitations');
            new IconButton({
              icon: 'fa fa-plus',
              label: 'Invite-Hackers',
              onClick: () => {
                router.navigateTo(`/client/invite-hackers/${this.projectId}`);
              },
            }).render(q);
          });
        });
      }
    });
  }
}
