import { router } from '@ui_lib/router';
import { ProjectInfoCacheMock, ProjectInfo } from '@data/validator/cache/projectInfo';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import { IconButton } from '@components/button/icon.button';
import { OverviewPayments } from '@/views/validator/projectDashboard/tabOverviewContent/hackerComponents/payments';
import { OverviewReports } from '@/views/validator/projectDashboard/tabOverviewContent/hackerComponents/reports';
import { OverviewBasicInfo } from '@/views/validator/projectDashboard/tabOverviewContent/hackerComponents/basicInfo';
import { CACHE_STORE } from '@data/cache';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';

export default class Hacker {
  projectInfo: ProjectInfo = {} as ProjectInfo;

  constructor(private readonly projectId: string) {
    this.projectId = projectId;
  }

  private readonly projectInfoCache = CACHE_STORE.getProjectInfo(this.projectId) as ProjectInfoCacheMock;

  async loadData(): Promise<void> {
    try {
      this.projectInfo = await this.projectInfoCache.get(false, this.projectId);
      console.log('Project Info', this.projectInfo);
    } catch (error) {
      console.error('Failed to load project data', error);
    }
  }

  async render(q: Quark): Promise<void> {
    const loading = new LoadingScreen(q);
    loading.show();

    await this.loadData();
    loading.hide();

    $(q, 'div', 'project-info', {}, (q) => {
      $(q, 'p', 'project-description', {}, this.projectInfo.description);

      $(q, 'div', '', { id: 'basic-info' }, (q) => {
        new OverviewBasicInfo(this.projectId, this.projectInfo.client).render(q);
      });

      $(q, 'section', '', {}, (q) => {
        $(q, 'h2', '', {}, 'Rules and Scope');
        $(q, 'ul', 'section-content', {}, (q) => {
          this.projectInfo.scope.forEach((rule) => {
            $(q, 'li', '', {}, rule);
          });
        });
      });

      $(q, 'section', '', { id: 'payments' }, (q) => {
        $(q, 'h2', '', {}, 'Payments');
        new OverviewPayments(this.projectId).render(q);
      });

      $(q, 'section', '', { id: 'reports' }, (q) => {
        $(q, 'span', '', {}, (q) => {
          $(q, 'h2', '', {}, 'Reports');
          new IconButton({
            icon: 'fa fa-plus',
            label: 'Create Report',
            onClick: () => {
              const url = '/report/' + this.projectId;
              router.navigateTo(url);
            },
          }).render(q);
        });

        $(q, 'div', 'section-content', {}, (q) => {
          new OverviewReports({ reportId: '1' }).render(q);
        });
      });
    });
  }
}
