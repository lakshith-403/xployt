import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import ProjectInfo from './1_ProjectInfo/ProjectInfo';
import TestingSecurity from './2_TestingSecurity/TestingSecurity';
import Payments from './3_Payment/Payments';
import MultistepForm from './../../../components/multistepForm/multistep-form';
import './projectConfigForm.scss';
import { router } from '@/ui_lib/router';

interface Step {
  title: string;
  step: any;
  stateUsed: { [key: string]: 'optional' | 'required' };
}

class ProjectConfigForm extends View {
  private formState: any = {
    projectTitle: '',
    startDate: {
      day: '',
      month: '',
      year: '',
    },
    endDate: {
      day: '',
      month: '',
      year: '',
    },
    description: '',
    url: '',
    technicalStack: '',
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

  private onSubmit: (formState: any) => void = () => {
    router.navigateTo('/');
  };

  render(q: Quark): void {
    const steps: Step[] = [
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

    const multistepForm = new MultistepForm(steps, this.formState, 'Apply', { progressBarLocation: 'bottom' }, this.onSubmit);
    $(q, 'div', 'project-config-form', {}, (q) => {
      $(q, 'h1', 'title', {}, 'Project Configuration Form');
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

export const projectConfigFormViewHandler = new ViewHandler('validator/project-config', ProjectConfigForm);
