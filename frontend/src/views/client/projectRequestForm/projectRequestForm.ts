import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import ProjectInfo from './1_ProjectInfo/ProjectInfo';
import MultistepForm, { ValidationSchema } from '../../../components/multistepForm/multistep-form';
import './projectRequestForm.scss';
import { Steps } from '@/components/multistepForm/multistep-form';
import { requestProject } from '@/data/client/network/projectConfig.network';

class ProjectRequestForm extends View {
  private formState: any = {
    title: 'sdf dfsdfs',
    startDate: {
      day: '6',
      month: '6',
      year: '2025',
    },
    endDate: {
      day: '6',
      month: '7',
      year: '2025',
    },
    description: 'ttttttttt',
    url: '',
    technicalStack: 'sdwd',
  };

  private onSubmit: (formState: any) => void = async (formState: any) => {
    await requestProject({
      ...formState,
      startDate: formState.startDate.year + '-' + formState.startDate.month + '-' + formState.startDate.day,
      endDate: formState.endDate.year + '-' + formState.endDate.month + '-' + formState.endDate.day,
    });
  };

  render(q: Quark): void {
    const steps: Steps[] = [
      {
        title: 'Project Information',
        step: new ProjectInfo(),
        stateUsed: {
          title: 'required',
          startDate: 'required',
          endDate: 'required',
          description: 'required',
          url: 'required',
          technicalStack: 'required',
        },
      },
    ];

    const validationSchema: ValidationSchema = {
      title: 'string',
      startDate: 'date|future',
      endDate: (formState: any) => {
        const startDate = new Date(formState.startDate.year, formState.startDate.month, formState.startDate.day);
        const endDate = new Date(formState.endDate.year, formState.endDate.month, formState.endDate.day);
        return endDate > startDate ? 'date|future' : 'date|future|min-date';
      },
      description: 'string-strict',
      url: 'url',
      technicalStack: 'string|comma',
    };

    const multistepForm = new MultistepForm(steps, this.formState, 'Submit', { progressBarLocation: 'progress-bar-hide' }, this.onSubmit, validationSchema);
    $(q, 'div', 'project-config-form', {}, (q) => {
      $(q, 'h1', 'title text-center heading-1 mb-2', {}, 'Project Configuration Form');
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

export const projectRequestFormViewHandler = new ViewHandler('/project-request', ProjectRequestForm);
