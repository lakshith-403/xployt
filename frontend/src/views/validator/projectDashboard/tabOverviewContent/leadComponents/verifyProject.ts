import { QuarkFunction as $, Quark } from '../../../../../ui_lib/quark';
import { FormTextField } from '../../../../../components/text_field/form.text_field';
// import './verifyProject.scss';
import { View, ViewHandler } from '@/ui_lib/view';
// import { Step } from './../../../../components/multistepForm/multistep-form';
import { ProjectOverviewLead, ProjectOverviewLeadCache, ProjectOverviewLeadCacheMock } from '@data/projectLead/cache/projectOverview';
import { CACHE_STORE } from '@/data/cache';
import { FormTextFieldDisabled } from '@/components/text_field/form.text_fields.disabled';
import { ButtonType } from '@/components/button/base';
import { FormButton } from '@/components/button/form.button';
import { rejectProject, acceptProject } from '@/data/projectLead/network/projectConfig.network';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import './verifyProject.scss';

class VerifyProject extends View {
  params: { projectId: string };
  private projectOverview!: ProjectOverviewLead;
  private projectOverviewCache!: ProjectOverviewLeadCache;
  protected shouldRenderBreadcrumbs(): boolean {
    return true;
  }

  protected setupBreadcrumbs(params: { projectId: string }): void {
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
      label: `Verify Project`,
      link: `/projects/${params.projectId}/verify`,
    });
  }
  constructor(params: { projectId: string }) {
    super(params);
    this.params = params;
    this.projectOverviewCache = CACHE_STORE.getLeadProjectOverview(this.params.projectId) as ProjectOverviewLeadCacheMock;
  }
  private async loadData(): Promise<void> {
    this.projectOverview = await this.projectOverviewCache.get(false, this.params.projectId);
  }
  async render(q: Quark): Promise<void> {
    await this.loadData();

    $(q, 'div', 'verify-project', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Project Information');

      this.renderFieldFullWidth(q, this.fields.projectTitle, this.projectOverview.title);
      $(q, 'div', 'dates', {}, (q) => {
        $(q, 'div', 'start-date date', {}, (q) => {
          $(q, 'span', '', {}, 'Start Date *');
          $(q, 'div', 'date-fields', {}, (q) => {
            this.renderCustomField(q, this.fields.startDateDay, this.projectOverview.startDateDay, 1 / 3);
            this.renderCustomField(q, this.fields.startDateMonth, this.projectOverview.startDateMonth, 1 / 3);
            this.renderCustomField(q, this.fields.startDateYear, this.projectOverview.startDateYear, 1 / 3);
          });
        });
        $(q, 'div', 'end-date date', {}, (q) => {
          $(q, 'span', '', {}, 'End Date *');
          $(q, 'div', 'date-fields', {}, (q) => {
            this.renderCustomField(q, this.fields.endDateDay, this.projectOverview.endDateDay, 1 / 3);
            this.renderCustomField(q, this.fields.endDateMonth, this.projectOverview.endDateMonth, 1 / 3);
            this.renderCustomField(q, this.fields.endDateYear, this.projectOverview.endDateYear, 1 / 3);
          });
        });
      });
      this.renderFieldFullWidth(q, this.fields.description, this.projectOverview.description);
      this.renderFieldFullWidth(q, this.fields.url, this.projectOverview.accessLink);
      this.renderFieldFullWidth(q, this.fields.technicalStack, this.projectOverview.technicalStack);

      $(q, 'div', 'button-container', {}, (q) => {
        const loading = new LoadingScreen(q);
        const rejectButton = new FormButton({
          label: 'Reject',
          type: ButtonType.SECONDARY,
          onClick: async () => {
            loading.show();
            console.log('Reject');
            await rejectProject(this.params.projectId);
            loading.hide();
          },
        });
        rejectButton.render(q);

        const acceptButton = new FormButton({
          label: 'Accept',
          type: ButtonType.PRIMARY,
          onClick: async () => {
            loading.show();
            console.log('Accept');
            await acceptProject(this.params.projectId);
            loading.hide();
          },
        });
        acceptButton.render(q);
      });
    });
  }

  private fields: { [key: string]: FormTextFieldDisabled } = {
    projectTitle: new FormTextFieldDisabled({ label: 'Project Title *', placeholder: 'Enter your project title', name: 'projectTitle' }),
    startDateDay: new FormTextFieldDisabled({ label: '', placeholder: 'DD', name: 'startDate.day' }),
    startDateMonth: new FormTextFieldDisabled({ label: '', placeholder: 'MM', name: 'startDate.month' }),
    startDateYear: new FormTextFieldDisabled({ label: '', placeholder: 'YYYY', name: 'startDate.year' }),
    endDateDay: new FormTextFieldDisabled({ label: '', placeholder: 'DD', name: 'endDate.day' }),
    endDateMonth: new FormTextFieldDisabled({ label: '', placeholder: 'MM', name: 'endDate.month' }),
    endDateYear: new FormTextFieldDisabled({ label: '', placeholder: 'YYYY', name: 'endDate.year' }),
    description: new FormTextFieldDisabled({ label: 'Description *', placeholder: 'Enter your description', name: 'description' }),
    url: new FormTextFieldDisabled({ label: 'URL *', placeholder: 'Enter your URL', name: 'url' }),
    technicalStack: new FormTextFieldDisabled({ label: 'Technical Stack *', placeholder: 'Enter your technical stack', name: 'technicalStack' }),
  };

  private renderFieldFullWidth(q: Quark, field: FormTextField, value: any): void {
    $(q, 'div', 'form-field', {}, (q) => {
      field.render(q);
      field.setValue(value);
      field.addClass('w-full');
    });
  }
  private renderCustomField(q: Quark, field: FormTextField, value: any, widthFraction: number): void {
    $(q, 'div', 'form-field', {}, (q) => {
      field.render(q);
      field.setValue(value);
      field.addClass(`w-${widthFraction}`);
    });
  }
}

export const verifyProjectHandler = new ViewHandler('/{projectId}/verify', VerifyProject);
