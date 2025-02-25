import { View, ViewHandler } from '@ui_lib/view';
import ProjectDetails from './Step1/PersonalDetails';
import Preferences from './Step2/Expertise';
import { TermsAndConditions } from './Step3/TermsAndConditions';
import MultistepForm, { ValidationSchema } from './../../../components/multistepForm/multistep-form';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import './validatorApplication.scss';
import { router } from '@/ui_lib/router';

import alertOnlyConfirm from '@alerts/alertOnlyConfirm.html';
import ModalManager, { convertToDom, setContent } from '@components/ModalManager/ModalManager';
import NETWORK from '@/data/network/network';
import { modalAlertForErrors } from '@/main';

// The modal for validator application
const modalElement = convertToDom(alertOnlyConfirm);
setContent(modalElement, {
  '.modal-title': 'Application Submitted',
  '.modal-message': 'Your application has been submitted successfully!',
});

// Add event listeners to the modal buttons
ModalManager.includeModal('applicationSubmitted', {
  '.button-confirm': () => {
    ModalManager.hide('applicationSubmitted');
  },
});

interface Step {
  title: string;
  step: any;
  stateUsed: { [key: string]: 'optional' | 'required' };
}

class ValidatorApplication extends View {
  private formState: any = {
    name: 'Geetha Savith',
    email: 'geetha@gmail.com',
    mobile: '9876543210',
    country: 'India',
    linkedin: 'https://www.linkedin.com/in/geetha/',
    dateOfBirth: {
      day: '1',
      month: '1',
      year: '1990',
    },
    skills: '',
    certificates: '',
    cv: null as File | null,
    references: '',
    relevantExperience: '',
    areaOfExpertise: ['Data Science', 'Machine Learning'],
    termsAndConditions: {
      0: true,
      1: true,
      2: true,
    },

    comments: '',
  };

  private onSubmit: (formState: any) => void = async () => {
    try {
      const response = await NETWORK.post('/api/validator/manage', this.formState, { showLoading: true });
      ModalManager.show('applicationSubmitted', modalElement, true).then(() => {
        console.log('response', response);
        router.navigateTo('/');
      });
    } catch (error: any) {
      console.error('Error submitting application:', error);
      setContent(modalAlertForErrors, {
        '.modal-title': 'Error',
        '.modal-message': `Failed to submit application: ${error.message}`,
        '.modal-data': error.data,
        '.modal-servletClass': error.servlet,
        '.modal-url': error.uri,
      });
      ModalManager.show('alertForErrors', modalAlertForErrors, true).then(() => {
        ModalManager.hide('alertForErrors');
      });
    }

    // router.navigateTo('/dashboard');
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
          linkedin: 'optional',
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
          termsAndConditions: 'optional',
          comments: 'optional',
        },
      },
    ];

    const validationSchema: ValidationSchema = {
      name: 'string|2',
      email: 'email',
      mobile: 'string',
      country: 'string',
      linkedin: 'url',
      dateOfBirth: 'date',
      skills: 'string|comma',
      certificates: 'string|comma',
      cv: 'string',
      references: 'string|comma',
      relevantExperience: 'string|comma',
      areaOfExpertise: 'object|string',
      comments: 'string',
    };

    const multistepForm = new MultistepForm(steps, this.formState, 'Apply', { progressBarLocation: 'progress-bar-bottom' }, this.onSubmit, validationSchema);
    $(q, 'div', 'validator-application', {}, (q) => {
      $(q, 'h1', 'title', {}, 'Validator Application');
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

export const validatorApplicationViewHandler = new ViewHandler('', ValidatorApplication);
