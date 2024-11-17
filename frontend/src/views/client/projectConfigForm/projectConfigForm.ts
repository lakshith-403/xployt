import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import ProjectInfo from './1_ProjectInfo/ProjectInfo';
import MultistepForm from './../../../components/multistepForm/multistep-form';
import './projectConfigForm.scss';
import { router } from '@/ui_lib/router';
import { Steps } from '@/components/multistepForm/multistep-form';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { submitProjectConfig } from '@/data/client/network/projectConfig.network';
// import TestingSecurity from './2_TestingSecurity/TestingSecurity';
// import Payments from './3_Payment/Payments';

class ProjectConfigForm extends View {
  private formState: any = {
    projectTitle: 'Hardcoded Project Title',
    startDate: {
      day: '1',
      month: '1',
      year: '2024',
    },
    endDate: {
      day: '1',
      month: '1',
      year: '2025',
    },
    description: 'Hardcoded Description',
    url: 'https://www.google.com',
    technicalStack: 'Hardcoded Technical Stack',
  };

  private onSubmit: (formState: any) => void = async (formState: any) => {
    const loading = new LoadingScreen(document.body); // Initialize the loading screen
    loading.show(); // Show loading screen

    try {
      await submitProjectConfig(formState);
      alert('Project configuration submitted successfully.');
      // router.navigateTo('/');
    } catch (error) {
      console.error('Error during form submission:', error);
      alert(`Failed to submit project configuration: ${error}`);
    } finally {
      loading.hide(); // Hide loading screen
    }
  };

  render(q: Quark): void {
    const steps: Steps[] = [
      {
        title: 'Project Information',
        step: new ProjectInfo(),
        stateUsed: {
          projectTitle: 'optional',
          startDate: 'optional',
          endDate: 'optional',
          description: 'optional',
          url: 'optional',
          technicalStack: 'optional',
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

export const projectConfigFormViewHandler = new ViewHandler('validator/project-config', ProjectConfigForm);

// testingScope: '',
// outOfScope: '',
// objectives: '',
// securityRequirements: '',
// critical: [],
// high: [],
// medium: [],
// low: [],
// informative: [],
// visibility: '',
// attachments: null as File | null,
// initialFunding: '',

// {
//   title: 'Testing and Security',
//   step: new TestingSecurity(),
//   stateUsed: {
//     testingScope: 'optional',
//     outOfScope: 'optional',
//     objectives: 'optional',
//     securityRequirements: 'optional',
//   },
// },
// {
//   title: 'Security Level Payment',
//   step: new Payments(),
//   stateUsed: {
//     critical: 'optional',
//     high: 'optional',
//     medium: 'optional',
//     low: 'optional',
//     informative: 'optional',
//     visibility: 'optional',
//     initialFunding: 'optional',
//   },
// },
