import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import MultistepForm from '@/components/multistepForm/multistep-form';
import './projectConfigForm.scss';
import { router } from '@/ui_lib/router';
import { Steps } from '@/components/multistepForm/multistep-form';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { submitProjectConfig } from '@/data/projectLead/network/projectConfig.network';
import TestingSecurity from './1_TestingSecurity/TestingSecurity';
import Payments from './2_Payment/Payments';

class ProjectConfigForm extends View {
  private formState: any = {
    testingScope: '',
    outOfScope: '',
    objectives: '',
    securityRequirements: '',
    critical: [],
    high: [],
    medium: [],
    low: [],
    informative: [],
    visibility: '',
    attachments: null as File | null,
    initialFunding: '',
  };

  private onSubmit: (formState: any) => void = async (formState: any) => {
    const loading = new LoadingScreen(document.body);
    loading.show();

    try {
      await submitProjectConfig(formState);
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
