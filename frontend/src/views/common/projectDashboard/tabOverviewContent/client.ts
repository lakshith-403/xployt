import { router } from '@ui_lib/router';
import { ProjectInfoCacheMock, ProjectInfo } from '@data/validator/cache/projectInfo';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import { IconButton } from '@components/button/icon.button';
import { OverviewPayments } from '@views/common/projectDashboard/tabOverviewContent/clientComponents/payments';
import { OverviewInvitations } from '@views/common/projectDashboard/tabOverviewContent/clientComponents/OverviewReports';
import { OverviewBasicInfo } from '@views/common/projectDashboard/tabOverviewContent/clientComponents/basicInfo';
import { CACHE_STORE } from '@data/cache';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import BasicInfoComponent from '@components/basicInfo/basicInfoComponent';
import NETWORK from '@data/network/network';
import { Button } from '@/components/button/base';
export default class Hacker {
  projectInfo: any;

  constructor(private readonly projectId: string) {
    this.projectId = projectId;
  }

  private readonly projectInfoCache = CACHE_STORE.getProjectInfo(this.projectId) as ProjectInfoCacheMock;

  async loadData(): Promise<void> {
    try {
      // this.projectInfo = await this.projectInfoCache.get(false, this.projectId);
      const response = await NETWORK.get(`/api/single-project/${this.projectId}?role=client`);
      this.projectInfo = response.data.project;
      console.log('Project Info', this.projectInfo);
    } catch (error) {
      console.error('Failed to load project data', error);
    }
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();

    $(q, 'div', 'project-info', {}, (q) => {
      $(q, 'div', 'd-flex justify-content-end pr-3', {}, (q) => {
        new Button({
          label: 'Edit Project',
          onClick: () => {
            router.navigateTo('/edit-project');
          },
        }).render(q);
      });

      $(q, 'p', 'project-description', {}, this.projectInfo.description);

      $(q, 'div', '', { id: 'basic-info' }, (q) => {
        new OverviewBasicInfo(this.projectId, this.projectInfo.clientId).render(q);
        new BasicInfoComponent(this.projectId, this.projectInfo.clientId).render(q);
      });

      $(q, 'section', '', {}, (q) => {
        $(q, 'h2', '', {}, 'Rules and Scope');
        $(q, 'ul', 'section-content', {}, (q) => {
          // Not supported yet
          if (this.projectInfo.scope) {
            this.projectInfo.scope.forEach((rule: string) => {
              $(q, 'li', '', {}, rule);
            });
          } else {
            $(q, 'li', '', {}, 'No rules or scope defined');
          }
        });
      });

      $(q, 'section', '', { id: 'payments' }, (q) => {
        $(q, 'h2', '', {}, 'Payments');
        new OverviewPayments(this.projectId).render(q);
      });

      if (this.projectInfo.state === 'Active') {
        $(q, 'section', '', { id: 'reports' }, (q) => {
          $(q, 'span', '', {}, (q) => {
            $(q, 'h2', '', {}, 'Hacker Invitations');
            new IconButton({
              icon: 'fa fa-plus',
              label: 'Invite-Hackers',
              onClick: () => {
                const url = '/invite-hackers';
                router.navigateTo(url);
              },
            }).render(q);
          });

          $(q, 'div', 'section-content', {}, (q) => {
            new OverviewInvitations({ reportId: '1' }).render(q);
          });
        });
      }
    });
  }
}
