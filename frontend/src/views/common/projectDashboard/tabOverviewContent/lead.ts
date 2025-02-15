import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
// import { configInfo, configInfoCache } from '@data/projectLead/cache/configInfo';
import './lead.scss';
// import { CACHE_STORE } from '@/data/cache';
import { ClientCacheMock } from '@/data/projectLead/cache/client.cache';
import { Client } from '@/data/projectLead/cache/client.cache';
import { FormButton } from '@/components/button/form.button';
import { ButtonType } from '@/components/button/base';
import { router } from '@/ui_lib/router';
import { OverviewPayments } from './hackerComponents/payments';
import { OverviewReports } from './hackerComponents/reports';
import PieChart from '@/components/charts/pieChart';
import NETWORK from '@/data/network/network';
export default class Lead {
  // private configInfo!: configInfo;
  // private configInfoCache!: configInfoCache;
  private configInfo: Record<string, any> = {};
  // private client: Record<string, any> = {};
  // private clientCache!: ClientCacheMock;
  // private client!: Client;
  constructor(private projectId: string) {
    console.log('at lead.ts constructor');
    console.log('this.projectId', this.projectId);
    // this.configInfoCache = CACHE_STORE.getLeadconfigInfo(this.projectId);
  }
  private async loadData(): Promise<void> {
    // this.configInfo = await this.configInfoCache.get(true, this.projectId);
    try {
      const response = await NETWORK.get(`/api/lead/project/${this.projectId}`, { showLoading: true });
      this.configInfo = response.data;
    } catch (error) {
      console.error('Error loading project config info:', error);
    }
    // this.clientCache = CACHE_STORE.getClient(this.configInfo.clientId.toString());
    // this.client = await this.clientCache.get();
    console.log('at lead.ts');
    // console.log('this.client', this.client);
    console.log('this.configInfo', this.configInfo);
    console.log('this.projectId', this.projectId);
    // console.log('this.configInfoCache', this.configInfoCache);
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();
    $(q, 'div', 'overview lead', {}, (q) => {
      $(q, 'section', 'info', {}, (q) => {
        $(q, 'div', 'info-item', {}, (q) => {
          $(q, 'span', 'label', {}, 'Client');
          $(q, 'span', '', {}, this.configInfo.name);
        });
        $(q, 'div', 'info-item', {}, (q) => {
          $(q, 'span', 'label', {}, 'Access link');
          $(q, 'span', '', {}, (q) => {
            $(q, 'a', '', {}, this.configInfo.url);
          });
        });
      });
      // $(q, 'div', 'team', {}, (q) => {
      //   $(q, 'span', '', {}, 'Team');
      // });
      $(q, 'section', '', {}, (q) => {
        $(q, 'div', 'label', {}, 'Description');
        $(q, 'p', '', {}, this.configInfo.description);
      });
      console.log(this.configInfo.state);

      $(q, 'section', '', {}, (q) => {
        $(q, 'div', 'state', {}, (q) => {
          $(q, 'span', 'label', {}, 'State');
          $(q, 'span', '', {}, this.configInfo.state);
        });
        switch (this.configInfo.state) {
          case 'Pending':
            $(q, 'div', '', {}, (q) => {
              const verifyButton = new FormButton({
                label: 'Verify Project',
                type: ButtonType.PRIMARY,
                onClick: () => {
                  console.log('Verify Project');
                  router.navigateTo(`/projects/${this.projectId}/verify`);
                },
              });
              verifyButton.render(q);
            });
            break;
          case 'Unconfigured':
            $(q, 'div', '', {}, (q) => {
              $(q, 'div', '', {}, (q) => {
                $(q, 'h2', '', {}, '');
              });
              $(q, 'div', '', {}, (q) => {
                const configureButton = new FormButton({
                  label: 'Configure Project',
                  type: ButtonType.PRIMARY,
                  onClick: () => {
                    console.log('Configure Project');
                    router.navigateTo(`/projects/${this.projectId}/configure`);
                  },
                });
                configureButton.render(q);
              });
            });
            break;
          case 'Active':
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

                  // Instantiate and render the PieChart
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
            break;
        }
      });
    });
  }
}
