import { View, ViewHandler } from '@ui_lib/view';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { formObject } from '@views/hacker/VulnerabilityReport/VulnerabilityReportForm';
import { ReportElement } from '@views/common/ReportReview/components/ReportElement';
import UserCard from '@components/UserCard';
import { ReportStepElement } from '@views/common/ReportReview/components/step';

export class ReportReview extends View {
  private reportId: string;
  private projectId: string;
  private formData: formObject;

  constructor(params: { projectId: string; reportId: string }) {
    super(params);
    this.reportId = params.reportId;
    this.projectId = params.projectId;
    this.formData = {
      vulnerabilityType: 'test',
      severity: 'test',
      reportTitle: 'test',
      description: 'test',
      steps: [
        {
          description: 'test',
          attachments: ['test'],
        },
      ],
      agreement: false,
      testDate: 'test',
    };
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

  async render(q: Quark) {
    $(q, 'div', 'report-review', {}, async (q) => {
      $(q, 'h1', 'title', {}, `Vulnerability Report | Project #${this.projectId}`);
      $(q, 'div', 'report-review-header', {}, async (q) => {
        await new UserCard('105', 'hacker', 'hacker flex-1', 'Hacker', {
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
        (Object.keys(this.formData) as Array<keyof formObject>).forEach((key) => {
          if (key !== 'steps' && key !== 'agreement') {
            new ReportElement(key.charAt(0).toUpperCase() + key.slice(1), this.formData[key].toString()).render(q);
          }
        });
      }

      $(q, 'h2', 'section-subtitle', {}, 'Proof of Concept');
      this.formData.steps.forEach((step, index) => {
        new ReportStepElement(index + 1, step).render(q);
      });
    });
  }
}

export const vulnReportReviewViewHandler = new ViewHandler('/vulnerability/{projectId}/{reportId}', ReportReview);
