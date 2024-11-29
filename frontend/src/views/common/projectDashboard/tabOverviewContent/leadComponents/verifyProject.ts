import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { FormTextField } from '@components/text_field/form.text_field';
// import './verifyProject.scss';
import { router } from '@ui_lib/router';
import { View, ViewHandler } from '@ui_lib/view';
// import { Step } from './../../../../components/multistepForm/multistep-form';
import { CACHE_STORE } from '@data/cache';
import { FormTextFieldDisabled } from '@components/text_field/form.text_fields.disabled';
import { ButtonType } from '@components/button/base';
import { FormButton } from '@components/button/form.button';
import { rejectProject, acceptProject } from '@data/projectLead/network/projectConfig.network';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import './verifyProject.scss';
import { ProjectConfigInfo, ProjectConfigInfoCache } from '@data/projectLead/cache/projectConfigInfo';
// import { CacheObject } from '@/data/cacheBase';

class VerifyProject extends View {
  params: { projectId: string };
  private projectConfigInfo!: ProjectConfigInfo;
  private projectConfigInfoCache!: ProjectConfigInfoCache;
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
    this.projectConfigInfoCache = CACHE_STORE.getLeadProjectConfigInfo(this.params.projectId) as ProjectConfigInfoCache;
  }
  private async loadData(): Promise<void> {
    this.projectConfigInfo = await this.projectConfigInfoCache.get(false, this.params.projectId);
  }
  async render(q: Quark): Promise<void> {
    await this.loadData();

    $(q, 'div', 'verify-project', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Project Information');

      this.renderFieldFullWidth(q, this.fields.projectTitle, this.projectConfigInfo.title);
      $(q, 'div', 'dates', {}, (q) => {
        $(q, 'div', 'start-date date', {}, (q) => {
          $(q, 'span', '', {}, 'Start Date ');
          $(q, 'div', 'date-fields', {}, (q) => {
            this.renderCustomField(q, this.fields.startDateDay, this.projectConfigInfo.startDateDay, 1 / 3);
            this.renderCustomField(q, this.fields.startDateMonth, this.projectConfigInfo.startDateMonth, 1 / 3);
            this.renderCustomField(q, this.fields.startDateYear, this.projectConfigInfo.startDateYear, 1 / 3);
          });
        });
        $(q, 'div', 'end-date date', {}, (q) => {
          $(q, 'span', '', {}, 'End Date ');
          $(q, 'div', 'date-fields', {}, (q) => {
            this.renderCustomField(q, this.fields.endDateDay, this.projectConfigInfo.endDateDay, 1 / 3);
            this.renderCustomField(q, this.fields.endDateMonth, this.projectConfigInfo.endDateMonth, 1 / 3);
            this.renderCustomField(q, this.fields.endDateYear, this.projectConfigInfo.endDateYear, 1 / 3);
          });
        });
      });
      this.renderFieldFullWidth(q, this.fields.description, this.projectConfigInfo.description);
      this.renderFieldFullWidth(q, this.fields.url, this.projectConfigInfo.accessLink);
      this.renderFieldFullWidth(q, this.fields.technicalStack, this.projectConfigInfo.technicalStack);

      $(q, 'div', 'button-container', {}, (q) => {
        const loading = new LoadingScreen(q);
        const rejectButton = new FormButton({
          label: 'Reject',
          type: ButtonType.SECONDARY,
          onClick: async () => {
            loading.show();
            console.log('Reject');
            await rejectProject(this.params.projectId);
            await CACHE_STORE.updateLeadProjectConfigInfo(this.params.projectId, 'Rejected');
            CACHE_STORE.getProjects().updateProject(parseInt(this.params.projectId), 'Rejected');
            router.navigateTo(`/projects/${this.params.projectId}`);
            window.location.reload();
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
            await CACHE_STORE.updateLeadProjectConfigInfo(this.params.projectId, 'Unconfigured');
            CACHE_STORE.getLeadProjects((await CACHE_STORE.getUser().get()).id).updateProject(parseInt(this.params.projectId), 'Unconfigured');
            $(q, 'a', 'button', { href: `/projects/${this.params.projectId}` }, 'Go to Project').click();
            // router.navigateTo(`/projects/${this.params.projectId}`);
            loading.hide();
          },
        });
        acceptButton.render(q);
      });
    });
  }

  private fields: { [key: string]: FormTextFieldDisabled } = {
    projectTitle: new FormTextFieldDisabled({ label: 'Project Title ', placeholder: 'Enter your project title', name: 'projectTitle' }),
    startDateDay: new FormTextFieldDisabled({ label: '', placeholder: 'DD', name: 'startDate.day' }),
    startDateMonth: new FormTextFieldDisabled({ label: '', placeholder: 'MM', name: 'startDate.month' }),
    startDateYear: new FormTextFieldDisabled({ label: '', placeholder: 'YYYY', name: 'startDate.year' }),
    endDateDay: new FormTextFieldDisabled({ label: '', placeholder: 'DD', name: 'endDate.day' }),
    endDateMonth: new FormTextFieldDisabled({ label: '', placeholder: 'MM', name: 'endDate.month' }),
    endDateYear: new FormTextFieldDisabled({ label: '', placeholder: 'YYYY', name: 'endDate.year' }),
    description: new FormTextFieldDisabled({ label: 'Description ', placeholder: 'Enter your description', name: 'description' }),
    url: new FormTextFieldDisabled({ label: 'URL ', placeholder: 'Enter your URL', name: 'url' }),
    technicalStack: new FormTextFieldDisabled({ label: 'Technical Stack ', placeholder: 'Enter your technical stack', name: 'technicalStack' }),
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
