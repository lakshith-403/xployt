import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import MultistepForm from '@/components/multistepForm/multistep-form';
import './projectConfigForm.scss';
import { Steps } from '@/components/multistepForm/multistep-form';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { submitProjectConfig } from '@/data/projectLead/network/projectConfig.network';
import TestingSecurity from './1_TestingSecurity/TestingSecurity';
import Payments from './2_Payment/Payments';

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
    testingScope: 'Test Data',
    outOfScope: 'Test Data',
    objectives: 'Test Data',
    securityRequirements: 'Test Data',
    critical: ['Test Data'],
    high: ['Test Data'],
    medium: ['Test Data'],
    low: ['Test Data'],
    informative: ['Test Data'],
    visibility: 'Test Data',
    attachments: null as File | null,
    initialFunding: 'Test Data',
  };

  private onSubmit: (formState: any) => void = async (formState: any) => {
    const loading = new LoadingScreen(document.body);
    loading.show();

    try {
      await submitProjectConfig(this.params.projectId, formState);
      alert('Project configuration submitted successfully.');
      // router.navigateTo('/');
    } catch (error) {
      console.error('Error during form submission:', error);
      alert(`Failed to submit project configuration: ${error}`);
    } finally {
      loading.hide();
    }
  };

  render(q: Quark): void {
    const steps: Steps[] = [
      {
        title: 'Testing and Security',
        step: new TestingSecurity(),
        stateUsed: {
          testingScope: 'optional',
          outOfScope: 'optional',
          objectives: 'optional',
          securityRequirements: 'optional',
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
        },
      },
    ];

    const multistepForm = new MultistepForm(steps, this.formState, 'Submit', { progressBarLocation: 'progress-bar-hide' }, this.onSubmit);
    $(q, 'div', 'project-config-form', {}, (q) => {
      $(q, 'h1', 'title', {}, 'Project Configuration Form');
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

export const projectConfigFormViewHandler = new ViewHandler('/{projectId}/configure', ProjectConfigForm);
