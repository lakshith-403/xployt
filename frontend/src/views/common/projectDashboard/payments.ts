import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { User, UserCache } from '@data/user';
import { UserType } from '@data/user';
import { CACHE_STORE } from '@data/cache';
import { OverviewPayments } from './tabOverviewContent/commonComponents/payments';
import PieChart from '@/components/charts/pieChart';
export default class Payments {
  private userCache: UserCache;
  private role!: UserType;

  constructor(private projectId: string, private user: any, private projectInfo: any) {
    this.userCache = CACHE_STORE.getUser();
    this.user = user;
    this.role = user.type;
    this.projectInfo = projectInfo.project;
    console.log('projectInfo', this.projectInfo.project);
  }

  private async loadData(): Promise<void> {
    try {
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  }

  async render(q: Quark): Promise<void> {
    $(q, 'div', ' py-2 d-flex flex-column align-items-center', {}, (q) => {
      // const paymentsTableContainer = $(q, 'div', 'container', {}, (q) => {
      //   $(q, 'div', 'text-center sub-heading-3 bg-secondary container p-2 text-default', {}, 'Loading payments...');
      // });

      // Payments Section - for Active state and ProjectLead, Client, Admin roles
      if (this.projectInfo.state === 'Active') {
        $(q, 'div', '', { id: 'basic-info' }, (q) => {
          $(q, 'section', '', { id: 'payments' }, (q) => {
            $(q, 'div', '', {}, (q) => {
              $(q, 'h2', '', {}, 'Payments');
              new OverviewPayments(this.projectId, this.role).render(q);
            });
            // CHECK - Fix when data available
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
        });
      } else {
        $(q, 'div', '', {}, (q) => {
          $(q, 'h2', '', {}, 'Payments');
          $(q, 'div', '', {}, (q) => {
            $(q, 'p', '', {}, 'Payments are not available for this project.');
          });
        });
      }
    });

    // await this.loadData();
    // switch (this.role) {
    //   case 'ProjectLead':
    //     const lead = new Lead(this.projectId);
    //     lead.render(q);
    //     break;
    //   case 'Client':
    //     const client = new Client(this.projectId);
    //     client.render(q);
    //     break;
    //   case 'Hacker':
    //     const hacker = new Hacker(this.projectId);
    //     hacker.render(q);
    //     break;
    // }
  }
}
