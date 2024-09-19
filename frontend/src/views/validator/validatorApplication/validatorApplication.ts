import { View, ViewHandler } from '@ui_lib/view';
import ProjectDetails from './Step1/PersonalDetails';
import Preferences from './Step2/Preferences';
import MultistepForm from '@/components/multistepForm/multistep-form';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import './validatorApplication.scss';

interface Step {
  title: string;
  step: any;
  stateUsed: { [key: string]: 'optional' | 'required' };
}

class ValidatorApplication extends View {
  private formState: any = {
    name: '',
    email: '',
    mobile: '',
    country: '',
    linkedin: '',
    dateOfBirth: {
      day: '',
      month: '',
      year: '',
    },
  };

  private onSubmit: (formState: any) => void = () => {};

  render(q: Quark): void {
    const steps: Step[] = [
      {
        title: 'Project Details',
        step: new ProjectDetails(),
        stateUsed: {
          name: 'required',
          email: 'required',
          mobile: 'required',
          country: 'required',
          linkedin: 'required',
          dateOfBirth: 'required',
        },
      },
      {
        title: 'Preferences',
        step: new Preferences(),
        stateUsed: {
          preferences: 'optional',
        },
      },
    ];

    const multistepForm = new MultistepForm(steps, this.formState, 'Apply', this.onSubmit);
    $(q, 'div', 'validator-application', {}, (q) => {
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

export const validatorApplicationViewHandler = new ViewHandler('validator/application', ValidatorApplication);
