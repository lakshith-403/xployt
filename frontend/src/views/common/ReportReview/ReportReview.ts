import { View, ViewHandler } from '@ui_lib/view';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { ReportElement } from '@views/common/ReportReview/components/ReportElement';
import UserCard from '@components/UserCard';
import { ReportStepElement } from '@views/common/ReportReview/components/step';
import { VulnerabilityReport, VulnerabilityReportCache } from '@data/common/cache/vulnerabilityReport.cache';
import { CACHE_STORE } from '@data/cache';
import { Loader } from '@views/discussion/Loader';
import './ReportReview.scss';
import NotFound from '@components/notFound/notFound';
import { User } from '@data/user';
import { Button, ButtonType } from '@components/button/base';
import { router } from '@ui_lib/router';
import { FormButton } from '@/components/button/form.button';
import { ReportAction } from './reportAction';
import NETWORK from '@/data/network/network';

export class ReportReview extends View {
  private readonly reportId: string;
  private readonly projectId: string;
  private hackerId: string = '';
  private vulnerabilityReportCache: VulnerabilityReportCache;
  private formData: VulnerabilityReport | null = null;
  private loader: Loader;
  private user!: User;
  private reportAction: ReportAction;

  constructor(params: { projectId: string; reportId: string }) {
    super(params);
    this.reportId = params.reportId;
    this.projectId = params.projectId;

    this.vulnerabilityReportCache = CACHE_STORE.getVulnerabilityReport(this.reportId);

    this.loader = new Loader();
    this.reportAction = new ReportAction({
      reportId: this.reportId,
      renderFunction: () => this.rerender(),
    });
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
    this.hackerId = this.formData?.hackerId || '';
    this.user = await CACHE_STORE.getUser().get();
    this.reportAction.setData(this.formData);
  }

  async render(q: Quark) {
    this.loader.show(q);
    await this.loadData();
    this.loader.hide();

    if (!this.formData) {
      new NotFound().render(q);
      return;
    }

    $(q, 'div', 'report-review-container d-flex flex-column', {}, async (q) => {
      $(q, 'div', 'report-review pb-2', {}, async (q) => {
        $(q, 'h1', 'title', {}, `Vulnerability Report | Project #${this.projectId}`);

        if (this.user.id === this.hackerId) {
          new Button({
            label: 'Edit Report',
            type: ButtonType.PRIMARY,
            onClick: () => {
              router.navigateTo(`/hacker/edit-report/${this.projectId}/${this.reportId}`);
            },
          }).render(q);
        }

        if (this.user.id === this.hackerId && this.formData?.status === 'More Info') {
          $(q, 'div', 'validator-comment', {}, (q) => {
            $(q, 'h2', 'section-subtitle', {}, 'Validator Comments');
            $(q, 'p', 'comment-text', {}, 'No comments provided.');
          });
        }

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
          (this.formData ? (Object.keys(this.formData) as Array<keyof VulnerabilityReport>) : []).forEach((key) => {
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
          : $(q, 'div', 'no-steps', {}, 'No steps provided for this report.');
      });
      if (this.formData?.status === 'Pending' && this.user.type === 'Validator') {
        $(q, 'div', 'report-review-footer container p-2 bg-secondary mb-2', {}, (q) => {
          $(q, 'span', 'd-block text-light-green mb-1', {}, 'Report Actions');
          $(q, 'div', 'buttons d-flex flex-row gap-2', {}, (q) => {
            const acceptReportButton = new FormButton({
              label: 'Accept Report',
              onClick: () => this.reportAction.render(q, 'Accept Report'),
              type: ButtonType.PRIMARY,
            });
            acceptReportButton.render(q);

            const rejectReportButton = new FormButton({
              label: 'Reject Report',
              onClick: () => this.reportAction.render(q, 'Reject Report'),
              type: ButtonType.SECONDARY,
            });
            rejectReportButton.render(q);
            const needMoreInfoButton = new FormButton({
              label: 'Need More Info',
              onClick: () => this.reportAction.render(q, 'Need More Info'),
              type: ButtonType.SECONDARY,
            });
            needMoreInfoButton.render(q);
          });
        });
      }
      if (this.formData?.status !== 'Pending') {
        $(q, 'div', 'report-review-footer container p-2 bg-secondary mb-2 filter-brightness-120', {}, async (q) => {
          $(q, 'span', 'd-block text-light-green mb-1', {}, 'Validator Feedback');
          try {
            const response = await NETWORK.get(`/api/reports/feedback/${this.reportId}`);
            const { feedback, updatedAt, assignedValidatorId } = response.data;

            $(q, 'div', 'feedback-container bg-tertiary rounded-1 p-2', {}, (q) => {
              $(q, 'p', 'mb-1', {}, `Last Updated: ${new Date(updatedAt).toLocaleString()}`);
              $(q, 'p', 'mb-1', {}, `Validator ID: ${assignedValidatorId}`);
              $(q, 'p', 'mb-0', {}, `Feedback: ${feedback || 'Feedback not provided'}`);
            });
          } catch (error) {
            console.error('Failed to fetch feedback:', error);
            $(q, 'p', 'text-error', {}, 'Failed to load feedback');
          }
        });
      }
    });
  }
}

export const vulnReportReviewViewHandler = new ViewHandler('/vulnerability/{projectId}/{reportId}', ReportReview);
