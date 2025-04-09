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
  params: { projectId: string; configured: string };
  configured: boolean;
  protected shouldRenderBreadcrumbs(): boolean {
    return true;
  }

  protected setupBreadcrumbs(params: { projectId: string; configured: string }): void {
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
      link: `/projects/${params.projectId}/configure/${params.configured}`,
    });
  }
  constructor(params: { projectId: string; configured: string }) {
    super(params);
    this.params = params;
    this.configured = /true/.test(params.configured);
    console.log('configured', this.configured);
    console.log('params', params);
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
    totalFunding: null,
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
    totalFunding: 'number|null',
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

      // Check if total funding is greater than the highest individual severity funding
      const highestFunding = Math.max(
        Number(formState.criticalFunding) || 0,
        Number(formState.highFunding) || 0,
        Number(formState.mediumFunding) || 0,
        Number(formState.lowFunding) || 0,
        Number(formState.informativeFunding) || 0
      );

      if (Number(formState.totalFunding) < highestFunding) {
        UIManager.showErrorModalBrief('Total funding must be greater than the highest severity funding.');
        return;
      }
      await submitProjectConfig(this.params.projectId, formState, this.configured);
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  async render(q: Quark): Promise<void> {
    const steps: Steps[] = [
      {
        title: 'Testing and Security',
        step: new TestingSecurity(),
        stateUsed: {
          testingScope: 'required',
          outOfScope: 'optional',
          objectives: 'optional',
          securityRequirements: 'optional',
          totalFunding: 'required',
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

    if (this.configured) {
      try {
        const response = await NETWORK.get(`/api/project/fetch/${this.params.projectId}`);
        const data = response.data;
        console.log('response', response);
        populateForm(this.formState, data);
        console.log('formState', this.formState);
      } catch (error) {
        console.error('Error during form submission:', error);
      }
    }

    const multistepForm = new MultistepForm(steps, this.formState, this.configured ? 'Update' : 'Submit', { progressBarLocation: 'progress-bar-hide' }, this.onSubmit, this.validationSchema);
    $(q, 'div', 'd-flex d-flex flex-column align-items-center justify-content-center', {}, (q) => {
      $(q, 'h1', 'title', {}, 'Project Configuration Form');
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

function populateForm(formState: any, data: any) {
  // Populate basic text fields if available
  if (data.outOfScope) {
    formState.outOfScope = data.outOfScope;
  }
  if (data.objectives) {
    formState.objectives = data.objectives;
  }
  if (data.securityRequirements) {
    formState.securityRequirements = data.securityRequirements;
  }

  // Populate Payment Amounts: assign amounts to the corresponding funding fields
  if (data.paymentAmounts && Array.isArray(data.paymentAmounts)) {
    data.paymentAmounts.forEach((entry: any) => {
      const level = entry.level.toLowerCase();
      const amount = entry.amount;
      switch (level) {
        case 'critical':
          formState.criticalFunding = amount;
          break;
        case 'high':
          formState.highFunding = amount;
          break;
        case 'medium':
          formState.mediumFunding = amount;
          break;
        case 'low':
          formState.lowFunding = amount;
          break;
        case 'informative':
          formState.informativeFunding = amount;
          break;
        default:
          break;
      }
    });
  }

  // Populate Payment Levels: assign items to the corresponding severity arrays
  if (data.paymentLevels && Array.isArray(data.paymentLevels)) {
    data.paymentLevels.forEach((entry: any) => {
      const level = entry.level.toLowerCase();
      const item = entry.item;
      switch (level) {
        case 'critical':
          if (!formState.critical.includes(item)) {
            formState.critical.push(item);
          }
          break;
        case 'high':
          if (!formState.high.includes(item)) {
            formState.high.push(item);
          }
          break;
        case 'medium':
          if (!formState.medium.includes(item)) {
            formState.medium.push(item);
          }
          break;
        case 'low':
          if (!formState.low.includes(item)) {
            formState.low.push(item);
          }
          break;
        case 'informative':
          if (!formState.informative.includes(item)) {
            formState.informative.push(item);
          }
          break;
        default:
          break;
      }
    });
    console.log('formState', formState);
  }

  // Populate Testing Scope with unique scope names derived from the scopes array
  if (data.scopes && Array.isArray(data.scopes)) {
    const uniqueScopes = Array.from(new Set(data.scopes.map((s: any) => s.scopeName)));
    formState.testingScope = uniqueScopes;
  }
}

export async function submitProjectConfig(projectId: string, formData: any, configured: boolean): Promise<void> {
  // Convert files to Base64 strings
  const attachmentsAsBase64 = await fileToBase64(formData.attachment);

  const url = configured ? `/api/lead/project/config?update=true` : `/api/lead/project/config`;
  await NETWORK.post(
    url,
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
        // router.navigateTo(`/projects/${projectId}`);
        window.location.href = `/projects/${projectId}`;
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

export const projectConfigFormViewHandler = new ViewHandler('/{projectId}/configure/{configured}', ProjectConfigForm);
