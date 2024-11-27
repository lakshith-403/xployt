import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import ProjectInfo from './1_ProjectInfo/ProjectInfo';
import MultistepForm from '../../../components/multistepForm/multistep-form';
import './projectRequestForm.scss';
import { Steps } from '@/components/multistepForm/multistep-form';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { requestProject } from '@/data/client/network/projectConfig.network';

class ProjectRequestForm extends View {
  private formState: any = {
    title: 'Hardcoded Project Title',
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
      await requestProject({
        ...formState,
        startDate: formState.startDate.year + '-' + formState.startDate.month + '-' + formState.startDate.day,
        endDate: formState.endDate.year + '-' + formState.endDate.month + '-' + formState.endDate.day,
      });
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

export const projectRequestFormViewHandler = new ViewHandler('project-request', ProjectRequestForm);
