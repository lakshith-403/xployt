import { View, ViewHandler } from '@ui_lib/view';
import ProjectDetails from './Step1/PersonalDetails';
import Preferences from './Step2/Preferences';
import MultistepForm from '@/components/multistepForm/multistep-form';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';

class ValidatorApplication extends View {
  private formState: any = {
    name: '',
    email: '',
    mobile: '',
    country: '',
    linkedin: '',
    dateOfBirth: '',
  };

  render(q: Quark): void {
    const steps = [
      {
        title: 'Project Details',
        step: new ProjectDetails(),
      },
      {
        title: 'Preferences',
        step: new Preferences(),
      },
    ];

    const multistepForm = new MultistepForm(steps, this.formState);
    $(q, 'div', 'validator-application', {}, (q) => {
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

export const validatorApplicationViewHandler = new ViewHandler('validator/application', ValidatorApplication);
