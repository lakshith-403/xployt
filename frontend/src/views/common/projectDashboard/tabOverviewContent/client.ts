import { router } from '@ui_lib/router';
import { IconButton } from '@components/button/icon.button';
import { OverviewPayments } from '@views/common/projectDashboard/tabOverviewContent/clientComponents/payments';
import { OverviewInvitations } from '@views/common/projectDashboard/tabOverviewContent/clientComponents/OverviewReports';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import NETWORK from '@data/network/network';
import { Button } from '@/components/button/base';
import { UIManager } from '@ui_lib/UIManager';
import UserCard from '@components/UserCard';
// import GenericCard from '@components/GenericCard';
// import BasicInfoComponent from '@components/basicInfo/basicInfoComponent';
// import { OverviewBasicInfo } from '@views/common/projectDashboard/tabOverviewContent/clientComponents/basicInfo';
// import { ProjectInfoCacheMock, ProjectInfo } from '@data/validator/cache/projectInfo';
// import { CACHE_STORE } from '@data/cache';
export default class Hacker {
  projectInfo: any;
  projectScopeList: any;

  constructor(private readonly projectId: string) {
    this.projectId = projectId;
  }

  // // private readonly projectInfoCache = CACHE_STORE.getProjectInfo(this.projectId) as ProjectInfoCacheMock;

  async loadData(): Promise<void> {
    try {
      // this.projectInfo = await this.projectInfoCache.get(false, this.projectId);
      const response = await NETWORK.get(`/api/single-project/${this.projectId}?role=Client`);
      this.projectInfo = response.data.project;
      console.log('Project Info', this.projectInfo);
    } catch (error) {
      console.error('Failed to load project data', error);
    }
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();

    $(q, 'div', 'd-flex flex-column gap-2', {}, (q) => {
      $(q, 'div', 'p-2 d-flex align-items-center justify-content-center', {}, (q) => {
        // new OverviewBasicInfo(this.projectId, this.projectInfo.clientId).render(q);
        // new BasicInfoComponent(this.projectId, this.projectInfo.clientId).render(q);
        new UserCard(this.projectInfo.leadId, 'lead', 'bg-secondary p-1 rounded-2 w-50', 'Lead Info', {
          highLightKeys: ['email'],
          highlightClassName: 'text-light-green',
          showKeys: ['name', 'email'],
          callback: () => {
            router.navigateTo('/user-info/' + this.projectInfo.leadId);
          },
        }).render(q);
      });

      $(q, 'div', '', {}, (q) => {
        $(q, 'h2', 'sub-heading-2', {}, 'Project Info');
        UIManager.listObjectGivenKeys(q, this.projectInfo, ['description', 'visibility', 'technicalStack', 'startDate'], { className: 'd-flex flex-column gap-1' });
      });

      $(q, 'div', 'd-flex pr-3 py-1 flex-column gap-2', {}, (q) => {
        if (this.projectInfo.state === 'Unconfigured') {
          new Button({
            label: 'Configure Project',
            onClick: () => {
              router.navigateTo(`/projects/${this.projectId}/configure/{false}`);
            },
          }).render(q);
        } else if (this.projectInfo.state === 'Configured') {
          new Button({
            label: 'Update Project Config',
            onClick: () => {
              router.navigateTo(`/projects/${this.projectId}/configure/{true}`);
            },
          }).render(q);
          $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
            $(q, 'span', '', {}, 'Awaiting Project Lead Confirmation');
          });
        } else if (this.projectInfo.state === 'Pending') {
          $(q, 'div', 'bg-secondary text-light-green px-2 py-1 rounded w-100 d-flex align-items-center justify-content-center', {}, (q) => {
            $(q, 'span', '', {}, 'Waiting approval');
          });
        }
      });

      if (['Configured', 'Active'].includes(this.projectInfo.state)) {
        $(q, 'section', '', {}, (q) => {
          $(q, 'h2', '', {}, 'Rules and Scope');
          this.projectScopeList = $(q, 'ul', 'section-content', {}, (q) => {
            // // Not supported yet
            // if (this.projectInfo.scope) {
            //   this.projectInfo.scope.forEach((rule: string) => {
            //     $(q, 'li', '', {}, rule);
            //   });
            // } else {
            //   $(q, 'li', '', {}, 'No rules or scope defined');
            // }
          });
        });
        $(q, 'section', '', { id: 'payments' }, (q) => {
          $(q, 'h2', '', {}, 'Payments');
          new OverviewPayments(this.projectId).render(q);
        });
      }

      if (['Active'].includes(this.projectInfo.state)) {
        $(q, 'section', '', { id: 'reports' }, (q) => {
          $(q, 'span', '', {}, (q) => {
            $(q, 'h2', '', {}, 'Hacker Invitations');
            new IconButton({
              icon: 'fa fa-plus',
              label: 'Invite-Hackers',
              onClick: () => {
                const url = `/client/invite-hackers/${this.projectId}`;
                router.navigateTo(url);
              },
            }).render(q);
          });

          $(q, 'div', '', {}, (q) => {
            // new OverviewInvitations({ reportId: '1' }).render(q);
            // new GenericCard(`/api/project-invitations/${this.projectId}`, 'Total Price Pool', 'bg-secondary p-1 rounded-2 w-50').render(q);
          });
        });
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
  }
}
