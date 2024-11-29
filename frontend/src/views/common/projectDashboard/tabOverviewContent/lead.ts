import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { ProjectConfigInfo, ProjectConfigInfoCache } from '@data/projectLead/cache/projectConfigInfo';
import './lead.scss';
import { CACHE_STORE } from '@/data/cache';
import { ClientCacheMock } from '@/data/projectLead/cache/client.cache';
import { Client } from '@/data/projectLead/cache/client.cache';
import { FormButton } from '@/components/button/form.button';
import { ButtonType } from '@/components/button/base';
import { router } from '@/ui_lib/router';
import { OverviewPayments } from './hackerComponents/payments';
import { OverviewReports } from './hackerComponents/reports';
import PieChart from '@/components/charts/pieChart';

export default class Lead {
  private projectConfigInfo!: ProjectConfigInfo;
  private projectConfigInfoCache!: ProjectConfigInfoCache;
  private clientCache!: ClientCacheMock;
  private client!: Client;
  constructor(private projectId: string) {
    console.log('at lead.ts constructor');
    console.log('this.projectId', this.projectId);
    this.projectConfigInfoCache = CACHE_STORE.getLeadProjectConfigInfo(this.projectId);
  }
  private async loadData(): Promise<void> {
    this.projectConfigInfo = await this.projectConfigInfoCache.get(true, this.projectId);
    // this.clientCache = CACHE_STORE.getClient(this.projectConfigInfo.clientId.toString());
    // this.client = await this.clientCache.get();
    console.log('at lead.ts');
    // console.log('this.client', this.client);
    console.log('this.projectConfigInfo', this.projectConfigInfo);
    console.log('this.projectId', this.projectId);
    console.log('this.projectConfigInfoCache', this.projectConfigInfoCache);
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();
    $(q, 'div', 'overview lead', {}, (q) => {
      $(q, 'section', 'info', {}, (q) => {
        $(q, 'div', 'info-item', {}, (q) => {
          $(q, 'span', 'label', {}, 'Client');
          $(q, 'span', '', {}, this.projectConfigInfo.clientName);
        });
        $(q, 'div', 'info-item', {}, (q) => {
          $(q, 'span', 'label', {}, 'Access link');
          $(q, 'span', '', {}, (q) => {
            $(q, 'a', '', {}, this.projectConfigInfo.accessLink);
          });
        });
      });
      // $(q, 'div', 'team', {}, (q) => {
      //   $(q, 'span', '', {}, 'Team');
      // });
      $(q, 'section', '', {}, (q) => {
        $(q, 'div', 'label', {}, 'Description');
        $(q, 'p', '', {}, this.projectConfigInfo.description);
      });
      console.log(this.projectConfigInfo.status);

      $(q, 'section', '', {}, (q) => {
        $(q, 'div', 'status', {}, (q) => {
          $(q, 'span', 'label', {}, 'Status');
          $(q, 'span', '', {}, this.projectConfigInfo.status);
        });
        if (this.projectConfigInfo.status === 'Pending') {
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
        } else if (this.projectConfigInfo.status === 'Unconfigured') {
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
        } else if (this.projectConfigInfo.status === 'Active') {
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
        }
      });
    });
  }
}
