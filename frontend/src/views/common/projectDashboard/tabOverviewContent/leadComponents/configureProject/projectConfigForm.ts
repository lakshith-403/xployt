import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import MultistepForm, { ValidationSchema } from '@components/multistepForm/multistep-form';
import { Steps } from '@components/multistepForm/multistep-form';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import TestingSecurity from './1_TestingSecurity/TestingSecurity';
import Payments from './2_Payment/Payments';
import { router } from '@/ui_lib/router';
import NETWORK from '@/data/network/network';
class ProjectConfigForm extends View {
  params: { projectId: string };

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
      label: `Configure Project`,
      link: `/projects/${params.projectId}/configure`,
    });
  }
  constructor(params: { projectId: string }) {
    super(params);
    this.params = params;
  }
  private formState: any = {
    testingScope: 'testing',
    outOfScope: 'outOfScope testing',
    objectives: 'objectives testing',
    securityRequirements: 'securityRequirements testing',
    critical: [],
    high: [],
    medium: [],
    low: [],
    informative: [],
    visibility: 'visibility testing',
    attachments: null as File | null,
    initialFunding: 23000,
    criticalFunding: 23000,
    highFunding: 23000,
    mediumFunding: null,
    lowFunding: null,
    informativeFunding: null,
  };
  private validationSchema: ValidationSchema = {
    testingScope: 'string',
    outOfScope: 'string',
    objectives: 'string',
    securityRequirements: 'string',
    critical: 'object|string',
    high: 'object|string',
    medium: 'object|string',
    low: 'object|string',
    informative: 'object|string',
    visibility: 'string',
    criticalFunding: 'number|null',
    highFunding: 'number|null',
    mediumFunding: 'number|null',
    lowFunding: 'number|null',
    informativeFunding: 'number|null',
  };
  private onSubmit: (formState: any) => void = async (formState: any) => {
    try {
      await submitProjectConfig(this.params.projectId, formState);
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  render(q: Quark): void {
    const steps: Steps[] = [
      {
        title: 'Testing and Security',
        step: new TestingSecurity(),
        stateUsed: {
          testingScope: 'required',
          outOfScope: 'required',
          objectives: 'required',
          securityRequirements: 'required',
        },
      },
      {
        title: 'Security Level Payment',
        step: new Payments(),
        stateUsed: {
          critical: 'optional',
          high: 'optional',
          medium: 'optional',
          low: 'optional',
          informative: 'optional',
          visibility: 'optional',
          initialFunding: 'optional',
          criticalFunding: 'optional',
          highFunding: 'optional',
          mediumFunding: 'optional',
          lowFunding: 'optional',
          informativeFunding: 'optional',
        },
      },
    ];

    const multistepForm = new MultistepForm(steps, this.formState, 'Submit', { progressBarLocation: 'progress-bar-hide' }, this.onSubmit, this.validationSchema);
    $(q, 'div', 'd-flex d-flex flex-column align-items-center justify-content-center', {}, (q) => {
      $(q, 'h1', 'title', {}, 'Project Configuration Form');
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

export async function submitProjectConfig(projectId: string, formData: any): Promise<void> {
  // Convert files to Base64 strings
  const attachmentsAsBase64 = await fileToBase64(formData.attachment);

  await NETWORK.post(
    `/api/lead/project/config`,
    {
      ...formData,
      projectId: projectId,
      attachments: attachmentsAsBase64,
      low: Object.values(formData.low).join(','),
      medium: Object.values(formData.medium).join(','),
      high: Object.values(formData.high).join(','),
      critical: Object.values(formData.critical).join(','),
      informative: Object.values(formData.informative).join(','),
    },
    {
      showSuccess: true,
      successCallback: () => {
        // router.navigateTo(`/projects/${projectId}`);
      },
    }
  );
}

function fileToBase64(file: File): Promise<string> {
  if (!file) {
    return Promise.resolve('');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export const projectConfigFormViewHandler = new ViewHandler('/{projectId}/configure', ProjectConfigForm);
