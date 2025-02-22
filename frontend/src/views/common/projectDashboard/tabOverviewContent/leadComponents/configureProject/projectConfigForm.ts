import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import MultistepForm, { ValidationSchema } from '@components/multistepForm/multistep-form';
import { Steps } from '@components/multistepForm/multistep-form';
import TestingSecurity from './1_TestingSecurity/TestingSecurity';
import Payments from './2_Payment/Payments';
import NETWORK from '@/data/network/network';
import { UIManager } from '@/ui_lib/UIManager';
import { router } from '@/ui_lib/router';
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
    testingScope: [],
    outOfScope: '',
    objectives: '',
    securityRequirements: '',
    critical: [],
    high: [],
    medium: [],
    low: [],
    informative: [],
    // visibility: '',
    attachments: null as File | null,
    initialFunding: null,
    criticalFunding: null,
    highFunding: null,
    mediumFunding: null,
    lowFunding: null,
    informativeFunding: null,
  };
  private validationSchema: ValidationSchema = {
    testingScope: 'object|string',
    outOfScope: 'string|comma',
    objectives: 'string|comma',
    securityRequirements: 'string|comma',
    critical: 'object|string',
    high: 'object|string',
    medium: 'object|string',
    low: 'object|string',
    informative: 'object|string',
    // visibility: 'string',
    criticalFunding: 'number|null',
    highFunding: 'number|null',
    mediumFunding: 'number|null',
    lowFunding: 'number|null',
    informativeFunding: 'number|null',
  };
  private onSubmit: (formState: any) => void = async (formState: any) => {
    try {
      const { critical, high, medium, low, informative, criticalFunding, highFunding, mediumFunding, lowFunding, informativeFunding } = formState;
      // console.log('Critical:', critical);
      // console.log('High:', high);
      // console.log('Medium:', medium);
      // console.log('Low:', low);
      // console.log('Informative:', informative);
      // console.log('Critical Funding:', criticalFunding);
      // console.log('High Funding:', highFunding);
      // console.log('Medium Funding:', mediumFunding);
      // console.log('Low Funding:', lowFunding);
      // console.log('Informative Funding:', informativeFunding);
      const severityFundingPairs = [
        { severity: critical, funding: criticalFunding, name: 'Critical' },
        { severity: high, funding: highFunding, name: 'High' },
        { severity: medium, funding: mediumFunding, name: 'Medium' },
        { severity: low, funding: lowFunding, name: 'Low' },
        { severity: informative, funding: informativeFunding, name: 'Informative' },
      ];

      let atLeastOnePairFilled = false;

      for (const pair of severityFundingPairs) {
        if (
          (Object.keys(pair.severity).length > 0 && (pair.funding === null || pair.funding === '')) ||
          (Object.keys(pair.severity).length === 0 && pair.funding !== null && pair.funding !== '')
        ) {
          UIManager.showErrorModalBrief(`Data for ${pair.name} severity is incomplete.`);
          return;
        }
        if (Object.keys(pair.severity).length > 0 && pair.funding !== null && pair.funding !== '') {
          atLeastOnePairFilled = true;
        }
      }

      if (!atLeastOnePairFilled) {
        UIManager.showErrorModalBrief('At least one severity and funding pair must be fully filled.');
        return;
      }
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
          // visibility: 'optional',
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
      testingScope: Object.values(formData.testingScope).join(','),
      low: Object.values(formData.low).join(','),
      medium: Object.values(formData.medium).join(','),
      high: Object.values(formData.high).join(','),
      critical: Object.values(formData.critical).join(','),
      informative: Object.values(formData.informative).join(','),
    },
    {
      showSuccess: true,
      successCallback: () => {
        router.navigateTo(`/projects/${projectId}`);
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
