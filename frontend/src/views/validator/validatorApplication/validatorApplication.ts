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
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { ReportAttachment } from '@data/common/cache/vulnerabilityReport.cache';
import { isValidFileType } from '@components/multistepForm/validationUtils';

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

interface formState {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  country: string;
  linkedin: string;
  dateOfBirth: {
    day: string;
    month: string;
    year: string;
  };
  skills: string;
  // certificates?: any[];
  cv?: File | any;
  cvProcessed?: File[] | any[];
  references: string;
  relevantExperience: string;
  areaOfExpertise: string[];
  termsAndConditions: {
    0: boolean;
    1: boolean;
    2: boolean;
  };

  // comments: string;
}

class ValidatorApplication extends View {
  private formState: formState = {
    firstName: '',
    lastName: '',
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
    references: '',
    relevantExperience: '',
    areaOfExpertise: [],
    termsAndConditions: {
      0: true,
      1: true,
      2: true,
    },
    cv: null,
    cvProcessed: [],
    // certificates: [],
    // comments: '',
  };
  private files: File[][] = [];

  private prepareFiles(): void {
    console.log('File list', this.files);

    if (this.files.length > 0 && this.files[1].length > 0) {
      this.formState.cvProcessed = this.files[1].map((file) => {
        const id = crypto.randomUUID();
        console.log('Preparing cv', file);
        return {
          id,
          name: file.name,
          url: `${id}.${file.name.split('.').pop()}`,
        } as ReportAttachment;
      });
      console.log('Prepared CV', this.formState.cvProcessed);
    }
  }

  private onSubmit: (formState: any) => void = async () => {
    let validation = true;
    try {
      const validFiles = this.files.flat().filter((file, index) => {
        if (!isValidFileType(file, true)) {
          validation = false;
          console.error('validation error: ', 'Invalid file');
          setContent(modalAlertOnlyOK, {
            '.modal-title': 'Validation Error',
            '.modal-message': `Invalid file ${file.name}`,
          });
          ModalManager.show('alertOnlyOK', modalAlertOnlyOK);

          index === 0 ? (this.files[0] = []) : this.files[1].splice(index - 1, 1);
          return false;
        }
        return true;
      });
      if (!validation) {
        return;
      }

      this.prepareFiles();

      const formData = new FormData();
      const formStateWithoutCV = { ...this.formState };
      delete formStateWithoutCV.cv;
      formData.append('application', JSON.stringify(formStateWithoutCV));

      // Append all valid files
      validFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await NETWORK.post('/api/validator/manage', formData, {
        dataTransferType: 'multipart/form-data',
        successCallback: () => {
          ModalManager.show('applicationSubmitted', modalElement, true).then(() => {
            console.log('response', response);
            router.navigateTo('/');
          });
        },
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
  };

  render(q: Quark): void {
    const steps: Step[] = [
      {
        title: 'Project Details',
        step: new ProjectDetails(),
        stateUsed: {
          firstName: 'required',
          lastName: 'required',
          email: 'required',
          mobile: 'required',
          country: 'required',
          linkedin: 'optional',
          dateOfBirth: 'required',
        },
      },
      {
        title: 'Expertise',
        step: new Preferences(this.files),
        stateUsed: {
          relevantExperience: 'optional',
          areaOfExpertise: 'optional',
          skills: 'optional',
          certificates: 'optional',
          cv: 'optional',
          references: 'optional',
        },
      },
      {
        title: 'Terms and Conditions',
        step: new TermsAndConditions(),
        stateUsed: {
          termsAndConditions: 'required',
          // comments: 'optional',
        },
      },
    ];

    const validationSchema: ValidationSchema = {
      firstName: 'single-word',
      lastName: 'single-word',
      email: 'email',
      mobile: 'tel',
      country: 'string',
      linkedin: 'url',
      dateOfBirth: 'date|past',
      skills: 'string|comma',
      certificates: 'string',
      cv: 'ignore',
      references: 'string|comma',
      relevantExperience: 'string|comma',
      areaOfExpertise: 'object|string',
      // comments: 'string',
    };

    const multistepForm = new MultistepForm(steps, this.formState, 'Apply', { progressBarLocation: 'progress-bar-bottom' }, this.onSubmit, validationSchema);
    $(q, 'div', 'validator-application container text-center', {}, (q) => {
      $(q, 'h1', 'title', {}, 'Validator Application');
      $(q, 'div', 'container', {}, (q) => {
        multistepForm.render(q);
      });
    });
  }
}

export const validatorApplicationViewHandler = new ViewHandler('', ValidatorApplication);
