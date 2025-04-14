import {View, ViewHandler} from '@ui_lib/view';
import {Quark, QuarkFunction as $} from '@ui_lib/quark';
import {ReportElement} from '@views/common/ReportReview/components/ReportElement';
import UserCard from '@components/UserCard';
import {ReportStepElement} from '@views/common/ReportReview/components/step';
import {VulnerabilityReport, VulnerabilityReportCache} from "@data/common/cache/vulnerabilityReport.cache";
import {CACHE_STORE} from "@data/cache";
import {Loader} from "@views/discussion/Loader";
import './ReportReview.scss'
import NotFound from "@components/notFound/notFound";

export class ReportReview extends View {
  private readonly reportId: string;
  private readonly projectId: string;
  private hackerId: string = '';
  private vulnerabilityReportCache: VulnerabilityReportCache;
  private formData: VulnerabilityReport | null = null;
  private loader: Loader

  constructor(params: { projectId: string; reportId: string }) {
    super(params);
    this.reportId = params.reportId;
    this.projectId = params.projectId;

    this.vulnerabilityReportCache = CACHE_STORE.getVulnerabilityReport(this.reportId);

    this.loader = new Loader();
  }

  protected shouldRenderBreadcrumbs(): boolean {
    return true;
  }

  protected setupBreadcrumbs(params: { projectId: string; reportId: string }): void {
    this.breadcrumbs?.clearBreadcrumbs();
    this.breadcrumbs?.addBreadcrumb({
      label: `Projects`,
      link: `/projects`,
    });
    this.breadcrumbs?.addBreadcrumb({
      label: `Project #${params.projectId}`,
      link: `/projects/${params.projectId}`,
    });
    this.breadcrumbs?.addBreadcrumb({
      label: `Report #${params.reportId}`,
      link: `projects/${params.projectId}/reports/${params.reportId}`,
    });
  }

  private async loadData(): Promise<void> {
      this.formData = await this.vulnerabilityReportCache.load();
  }

  async render(q: Quark) {

    this.loader.show(q);
    await this.loadData();
    this.loader.hide();

    if(!this.formData) {
        new NotFound().render(q)
        return
    }

    $(q, 'div', 'report-review', {}, async (q) => {
      $(q, 'h1', 'title', {}, `Vulnerability Report | Project #${this.projectId}`);
      $(q, 'div', 'report-review-header', {}, async (q) => {
        await new UserCard(this.hackerId, 'hacker', 'hacker flex-1', 'Hacker', {
          highLightKeys: ['email'],
          highlightClassName: 'highlight',
          showKeys: ['name', 'email'],
        }).render(q);

        $(q, 'div', 'project-info', {}, (q) => {
          $(q, 'span', 'project-element align-center', {}, (q) => {
            $(q, 'p', 'label', {}, 'Project ID');
            $(q, 'p', ``, {}, this.projectId);
          });
          $(q, 'span', 'project-element align-center', {}, (q) => {
            $(q, 'p', 'label', {}, 'Access Link');
            $(q, 'a', 'highlight', {}, `example.com/${this.projectId}`);
          });
        });
      });

      $(q, 'h2', 'section-subtitle', {}, 'Report Details');
      {
       (this.formData ? Object.keys(this.formData) as Array<keyof VulnerabilityReport> : []).forEach((key) => {
         if (key !== 'steps' && this.formData) {
           new ReportElement(key.charAt(0).toUpperCase() + key.slice(1), this.formData[key]?.toString() || '').render(q);
         }
       });
      }

      $(q, 'h2', 'section-subtitle', {}, 'Proof of Concept');
      this.formData && this.formData.steps.length > 0
          ? this.formData.steps.forEach((step, index) => {
            new ReportStepElement(step).render(q);
          })
          : $(q, 'div', 'no-steps', {}, "No steps provided for this report.");
    });
  }
}

export const vulnReportReviewViewHandler = new ViewHandler('/vulnerability/{projectId}/{reportId}', ReportReview);
