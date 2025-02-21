import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { FormTextField } from '@components/text_field/form.text_field';
import { router } from '@ui_lib/router';
import { View, ViewHandler } from '@ui_lib/view';
import { FormTextFieldDisabled } from '@components/text_field/form.text_fields.disabled';
import { ButtonType } from '@components/button/base';
import { FormButton } from '@components/button/form.button';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import './verifyProject.scss';
import NETWORK from '@/data/network/network';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertOnlyOK, modalAlertForErrors } from '@/main';

class VerifyProject extends View {
  params: { projectId: string };

  private projectConfigInfo: Record<string, any> = {};
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
  }
  private async loadData(): Promise<void> {
    this.projectConfigInfo = (await NETWORK.get(`/api/lead/project/${this.params.projectId}`, { showLoading: true })).data;
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
            console.log('Reject');
            const response = await NETWORK.post(`/api/lead/initiate/project/reject/${this.params.projectId}`, {}, { showLoading: true, handleError: true });
            setContent(modalAlertOnlyOK, {
              '.modal-title': 'Success',
              '.modal-message': 'Project rejected successfully.',
            });
            ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
              router.navigateTo(`/projects/${this.params.projectId}`);
              window.location.reload();
            });
          },
        });
        rejectButton.render(q);

        const acceptButton = new FormButton({
          label: 'Accept',
          type: ButtonType.PRIMARY,
          onClick: async () => {
            console.log('Accept');
            const response = await NETWORK.post(`/api/lead/initiate/project/accept/${this.params.projectId}`, {}, { showLoading: true, handleError: true });
            setContent(modalAlertOnlyOK, {
              '.modal-title': 'Success',
              '.modal-message': 'Project verifed and accepted successfully.',
            });
            ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
              router.navigateTo(`/projects/${this.params.projectId}`);
              window.location.reload();
            });
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
