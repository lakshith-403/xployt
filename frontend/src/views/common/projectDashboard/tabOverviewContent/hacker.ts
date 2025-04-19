import { router } from '@ui_lib/router';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import { IconButton } from '@components/button/icon.button';
import { OverviewPayments } from '@views/common/projectDashboard/tabOverviewContent/clientComponents/payments';
import { OverviewReports } from '@views/common/projectDashboard/tabOverviewContent/hackerComponents/reports';
import { CACHE_STORE } from '@data/cache';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import {Project, ProjectCache} from "@data/common/cache/project.cache";
import BasicInfoComponent from "@components/basicInfo/basicInfoComponent";
import {User} from "@data/user";

export default class Hacker {
  project: Project = {} as Project;
  private readonly projectCache = CACHE_STORE.getProject(this.projectId) as ProjectCache;
  private currentUser!: User;

  constructor(private readonly projectId: string) {
    this.projectId = projectId;
  }

  async loadData(): Promise<void> {
    try {
      this.project = await this.projectCache.get(false, this.projectId);
      this.currentUser = await CACHE_STORE.getUser().get();
      console.log('Hacker: Project Info', this.project);
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
      $(q, 'p', 'project-description', {}, this.project.description);

      $(q, 'div', '', { id: 'basic-info' }, (q) => {
        new BasicInfoComponent(this.project).render(q);
      });
      $(q, 'section', '', {}, (q) => {
        $(q, 'h2', '', {}, 'Rules and Scope');
        $(q, 'ul', 'section-content', {}, (q) => {
          this.project.scope.forEach((rule) => {
            $(q, 'li', '', {}, rule);
          });
        });
      });

      $(q, 'section', '', { id: 'payments' }, (q) => {
        $(q, 'h2', '', {}, 'Payments');
        new OverviewPayments(this.projectId, "Hacker", this.currentUser.id).render(q);
      });
      $(q, 'section', '', { id: 'reports' }, (q) => {
        $(q, 'span', '', {}, (q) => {
          $(q, 'h2', '', {}, 'Reports');
          new IconButton({
            icon: 'fa fa-plus',
            label: 'Create Report',
            onClick: () => {
              const url = '/hacker/new-report/' + this.projectId;
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
