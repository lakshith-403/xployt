import { View, ViewHandler } from '@ui_lib/view';
import ProjectDetails from './Step1/PersonalDetails';
import Preferences from './Step2/Expertise';
import { TermsAndConditions } from './Step3/TermsAndConditions';
import MultistepForm from './../../../components/multistepForm/multistep-form';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import './validatorApplication.scss';
import { router } from '@/ui_lib/router';
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
    skills: '',
    certificates: '',
    cv: null as File | null,
    references: '',
    relevantExperience: '',
    areaOfExpertise: [],
    termsAndConditions: {
      0: false,
      1: false,
      2: false,
    },
    comments: '',
  };

  private onSubmit: (formState: any) => void = () => {
    router.navigateTo('/');
  };

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
        title: 'Expertise',
        step: new Preferences(),
        stateUsed: {
          relevantExperience: 'optional',
          areaOfExpertise: 'optional',
          skills: 'optional',
          certificate: 'optional',
          cv: 'optional',
          references: 'optional',
        },
      },
      {
        title: 'Terms and Conditions',
        step: new TermsAndConditions(),
        stateUsed: {
          termsAndConditions: 'required',
          comments: 'optional',
        },
      },
    ];

    const multistepForm = new MultistepForm(steps, this.formState, 'Apply', { progressBarLocation: 'bottom' }, this.onSubmit);
    $(q, 'div', 'validator-application', {}, (q) => {
      $(q, 'h1', 'title', {}, 'Validator Application');
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

export const validatorApplicationViewHandler = new ViewHandler('validator/application', ValidatorApplication);
