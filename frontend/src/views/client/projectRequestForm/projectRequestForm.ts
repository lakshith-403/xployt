import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import ProjectInfo from './1_ProjectInfo/ProjectInfo';
import MultistepForm, { ValidationSchema } from '../../../components/multistepForm/multistep-form';
import './projectRequestForm.scss';
import { Steps } from '@/components/multistepForm/multistep-form';
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { requestProject } from '@/data/client/network/projectConfig.network';
import ModalManager, { convertToDom } from '@/components/ModalManager/ModalManager';
import { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertOnlyCancel } from '@/main';

import alertOnlyConfirm from '@alerts/alertOnlyConfirm.html';
import { router } from '@/ui_lib/router';

class ProjectRequestForm extends View {
  private formState: any = {
    title: 'Test Title',
    startDate: {
      day: '1',
      month: '1',
      year: '2025',
    },
    endDate: {
      day: '1',
      month: '1',
      year: '2025',
    },
    description: 'Test Description',
    url: 'https://www.google.com',
    technicalStack: 'Test Technical Stack',
  };

  private onSubmit: (formState: any) => void = async (formState: any) => {
    const loading = new LoadingScreen(document.body);
    loading.show();

    // try {
    await requestProject({
      ...formState,
      startDate: formState.startDate.year + '-' + formState.startDate.month + '-' + formState.startDate.day,
      endDate: formState.endDate.year + '-' + formState.endDate.month + '-' + formState.endDate.day,
    });
    loading.hide();
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
      startDate: 'date',
      endDate: 'date',
      description: 'string-strict',
      url: 'url',
      technicalStack: 'string-strict',
    };

    const multistepForm = new MultistepForm(steps, this.formState, 'Submit', { progressBarLocation: 'progress-bar-hide' }, this.onSubmit, validationSchema);
    $(q, 'div', 'project-config-form', {}, (q) => {
      $(q, 'h1', 'title', {}, 'Project Configuration Form');
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

export const projectRequestFormViewHandler = new ViewHandler('/project-request', ProjectRequestForm);
