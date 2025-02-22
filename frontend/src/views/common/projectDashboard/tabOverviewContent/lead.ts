import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import './lead.scss';
import { FormButton } from '@/components/button/form.button';
import { ButtonType } from '@/components/button/base';
import { router } from '@/ui_lib/router';
import { OverviewPayments } from './hackerComponents/payments';
import { OverviewReports } from './hackerComponents/reports';
import PieChart from '@/components/charts/pieChart';
import NETWORK from '@/data/network/network';
import UserCard from '@components/UserCard';
import { UIManager } from '@ui_lib/UIManager';
export default class Lead {
  private projectInfo: any;
  private detailedProjectInfoContainer: any;
  constructor(private projectId: string) {}
  private async loadData(): Promise<void> {
    try {
      const response = await NETWORK.get(`/api/single-project/${this.projectId}?role=lead`);
      this.projectInfo = response.data.project;
      console.log('this.projectInfo', this.projectInfo);
    } catch (error) {
      console.error('Error loading project config info:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();

    $(q, 'div', 'd-flex flex-column gap-2', {}, (q) => {
      $(q, 'div', 'p-2 d-flex align-items-center justify-content-center', {}, (q) => {
        new UserCard(this.projectInfo.clientId, 'client', 'bg-secondary p-1 rounded-2 w-50', 'Client Info', {
          highLightKeys: ['email'],
          highlightClassName: 'text-light-green',
          showKeys: ['name', 'email'],
          callback: () => {
            router.navigateTo('/user-info/' + this.projectInfo.clientId);
          },
        }).render(q);
      });

      $(q, 'div', '', {}, (q) => {
        $(q, 'h2', 'sub-heading-2', {}, 'Project Info');
        UIManager.listObjectGivenKeys(q, this.projectInfo, ['description', 'visibility', 'technicalStack', 'startDate', 'state'], { className: 'd-flex flex-column gap-1' });
      });

      $(q, 'div', 'd-flex py-1 flex-column gap-2 w-100', {}, (q) => {
        if (['Pending'].includes(this.projectInfo.state)) {
          $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
            $(q, 'span', '', {}, 'Waiting approval');
          });
          $(q, 'div', 'd-flex align-items-center justify-content-center', {}, (q) => {
            const button = new FormButton({
              label: 'Verify Project',
              type: ButtonType.PRIMARY,
              onClick: () => {
                console.log('Verify Project');
                router.navigateTo(`/projects/${this.projectId}/verify`);
              },
            });
            button.render(q);
            button.setClass('mt-0');
          });
        } else if (['Unconfigured'].includes(this.projectInfo.state)) {
          $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
            $(q, 'span', '', {}, 'Client yet to configure project');
          });
        } else if (['Configured'].includes(this.projectInfo.state)) {
          $(q, 'div', 'd-flex flex-column gap-2 align-items-center', {}, (q) => {
            this.detailedProjectInfoContainer = $(q, 'div', 'd-flex flex-column align-items-start gap-2 w-100', {}, '');
            $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center gap-3 justify-content-center', {}, (q) => {
              $(q, 'span', '', {}, 'Project Configured');

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
              button.setClass('mt-0');
            });
          });
        }

        if (['Active'].includes(this.projectInfo.state)) {
        }
      });

      try {
        if (!['Configured', 'Active'].includes(this.projectInfo.state)) return;
        // const response = await NETWORK.get(`/api/project-scope/${this.projectId}?role=client`);
        // this.projectScopeList.innerHTML = '';
        // UIManager.listObject(this.projectScopeList, response.data.scope);
      } catch (error) {
        console.error('Failed to load project scope', error);
      }

      const renderPaymentsSection = () => {
        $(q, 'div', '', { id: 'basic-info' }, (q) => {
          $(q, 'section', '', { id: 'payments' }, (q) => {
            $(q, 'div', '', {}, (q) => {
              $(q, 'h2', '', {}, 'Payments');
              new OverviewPayments(this.projectId).render(q);
            });
            $(q, 'div', '', {}, (q) => {
              const pieChartOptions = {
                data: {
                  'Pending Payments': 30000,
                  Paid: 20000,
                  Remaining: 30000,
                  'On Hold': 40000,
                },
                title: '',
                subtitle: '',
                colorScheme: 'greenTheme' as 'greenTheme',
              };

              $(q, 'div', '', {}, (q) => {
                $(q, 'h2', '', {}, 'Payments Distribution');
                const pieChart = new PieChart(pieChartOptions);
                pieChart.render(q);
              });
            });
          });
          $(q, 'div', 'section-content', {}, (q) => {
            $(q, 'h2', '', {}, 'Reports');
            new OverviewReports({ reportId: '1' }).render(q);
          });
        });
      };

      switch (this.projectInfo.state) {
        case 'Active':
          renderPaymentsSection();
          break;
      }
    });

    try {
      const response = await NETWORK.get(`/api/project/fetch/${this.projectId}`, { showLoading: true });
      // const data = response.data;
      // console.log('response', response);
      this.detailedProjectInfoContainer.innerHTML = '';
      $(this.detailedProjectInfoContainer, 'div', 'd-flex flex-column gap-2', {}, (q) => {
        UIManager.listArrayObjectValues(q, 'Payment Amounts', response.data.paymentAmounts, ['amount', 'level'], { className: 'd-flex flex-column gap-1' });
        UIManager.listArrayObjectValues(q, 'Scopes', response.data.scopes, ['scopeName'], { className: 'd-flex flex-column gap-1' });
      });
    } catch (error) {
      console.error('Failed to load project config info:', error);
    }
  }
}
