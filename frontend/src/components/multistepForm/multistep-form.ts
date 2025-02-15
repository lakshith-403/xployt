import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { ButtonType } from '../button/base';
import { FormButton } from '../button/form.button';
import { validateField, validateFormState } from './validationUtils';
// import { validateField } from './validationUtils';
import './multistep-form.scss';
import ModalManager, { setContent } from '../ModalManager/ModalManager';
import { modalAlertOnlyOK } from '@/main';

export abstract class Step {
  abstract render: (q: Quark, formState: any, updateParentState: (newState: any) => void) => void;
}
export interface ValidationSchema {
  [key: string]: 'string' | 'date' | 'array|string' | 'array|string-strict' | 'number' | 'string-strict' | 'url' | 'object|string' | 'email' | 'string|2';
}

export interface Steps {
  title: string;
  stateUsed: { [key: string]: 'optional' | 'required' };
  step: Step;
}

interface Config {
  [key: string]: any;
}

class MultistepForm {
  steps: Steps[];
  activeTabIndex: number;
  contentElement!: HTMLElement;
  tabsButtons!: HTMLElement;
  private stage: number = 0;
  private numOfSteps: number = 0;
  private nextButton: FormButton | null = null;
  private prevButton: FormButton | null = null;
  private submitButton: FormButton | null = null;
  private tabValidityStates: boolean[] = [];
  private formState: any = {};
  private lastAction: 'Submit' | 'Apply' = 'Submit';
  private onSubmit: (formState: any) => void;
  private config: { [key: string]: any } = {};
  private validationSchema: ValidationSchema;

  constructor(steps: Steps[], formState: any, lastAction: 'Submit' | 'Apply', config: Config = {}, onSubmit: (formState: any) => void, validationSchema: ValidationSchema) {
    this.validationSchema = validationSchema;
    this.steps = steps;
    this.activeTabIndex = 0;
    this.tabValidityStates = new Array(steps.length).fill(false);
    this.formState = formState;
    this.numOfSteps = steps.length;
    this.lastAction = lastAction;
    this.onSubmit = onSubmit;
    this.config = config || {};
    // //console.log(this.numOfSteps);
  }

  private validateCurrentTab(): boolean {
    console.log('validateCurrentTab', this.activeTabIndex);
    const currentStep = this.steps[this.activeTabIndex];
    let errorMessages: string[] = [];

    for (const key in currentStep.stateUsed) {
      const value = this.formState[key];
      // Validate only if the field is required and has a value
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0) &&
        !(typeof value === 'object' && value !== null && Object.values(value).every((v) => !v))
      ) {
        console.log('validateField', key, value);
        const validation = validateField(key, value, this.validationSchema[key]);
        if (!validation.result) {
          errorMessages.push(validation.message);
        }
      }
    }

    if (errorMessages.length > 0) {
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Validation Error',
        '.modal-message': errorMessages.join('\n'),
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      return false;
    }

    return true;
  }

  render(q: Quark): void {
    const form = $(q, 'div', 'multistep-form', {}, (q) => {
      this.tabsButtons = $(q, 'div', 'progress-bar', {}, (q) => {
        this.steps.forEach((step, index) => {
          $(q, 'button', 'step-button', { onclick: () => this.jumpToTab(index) }, (q) => {
            $(q, 'span', 'dot', {}, (q) => {});
          });
        });
      });
      $(q, 'div', 'form-body', {}, (q) => {
        $(q, 'div', 'tabs-content', {}, (q) => {
          this.contentElement = q;
          this.renderActiveTabContent();
        });

        $(q, 'div', 'form-buttons', {}, (q) => {
          this.prevButton = new FormButton({
            label: 'Prev',
            onClick: () => this.prevTab(),
            type: ButtonType.SECONDARY,
          });
          this.prevButton.render(q);
          this.prevButton.setClass('prev-button');
          this.prevButton.hide();

          this.nextButton = new FormButton({
            label: 'Next',
            onClick: () => this.nextTab(),
            type: ButtonType.SECONDARY,
          });
          this.nextButton.render(q);
          this.nextButton.setClass('next-button');
          this.nextButton.hide();

          this.submitButton = new FormButton({
            label: this.lastAction === 'Submit' ? 'Submit' : 'Apply',
            onClick: () => this.checkBeforeSubmit(),
            type: ButtonType.PRIMARY,
          });
          this.submitButton.render(q);
          this.submitButton.setClass('submit-button');
          this.submitButton.hide();
        });
      });
      this.switchTab(0);
    });

    if (this.config.progressBarLocation) {
      form.classList.add(this.config.progressBarLocation);
    }
    this.tabsButtons.children[this.activeTabIndex].classList.add('selected');
  }

  checkBeforeSubmit(): boolean {
    console.log('checkBeforeSubmit', this.formState, this.validationSchema);
    // if (validateFormState(this.formState, this.validationSchema)) {
    if (!validateFormState(this.formState, this.validationSchema)) {
      return false;
    }
    if (this.isCurrentTabValid()) {
      console.log('checkBeforeSubmit passed');
      this.onSubmit(this.formState);
      return true;
    } else {
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Validation Error',
        '.modal-message': 'Please fill all required fields',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      return false;
    }
    // } else {
    // alert('Form is invalid');
    // return false;
    // }
  }
  nextTab(): void {
    //console.log('Next Tab Clicked');
    if (!this.validateCurrentTab()) {
      console.log('validateCurrentTab failed');
      // setContent(validateErrorModal, {
      //   '.modal-title': 'Validation Error',
      //   '.modal-message': 'Please correct the errors in the current tab before proceeding.',
      // });
      // ModalManager.show('validateErrorModal', validateErrorModal);
      return;
    }
    console.log('validateCurrentTab passed');
    if (this.activeTabIndex + 1 <= this.stage && this.isCurrentTabValid()) {
      this.switchTab(this.activeTabIndex + 1);
    } else if (this.isCurrentTabValid()) {
      this.stage++;
      this.switchTab(this.activeTabIndex + 1);
    } else {
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Validation Error',
        '.modal-message': 'Please fill in all the required fields.',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
    }
  }

  prevTab(): void {
    //console.log('Prev Tab Clicked');
    if (this.activeTabIndex > 0) {
      this.switchTab(this.activeTabIndex - 1);
    }
  }

  jumpToTab(index: number): void {
    if (index > this.stage) {
      return;
    }
    this.switchTab(index);
  }

  switchTab(index: number): void {
    this.tabsButtons.children[this.activeTabIndex].classList.remove('selected');
    this.tabsButtons.children[index].classList.add('selected');
    this.activeTabIndex = index;
    if (index === 0 && this.numOfSteps > 1) {
      this.prevButton!.hide();
      this.nextButton!.show();
      this.submitButton!.hide();
    } else if (index === 0 && this.numOfSteps === 1) {
      //console.log('Only one step');
      this.prevButton!.hide();
      this.nextButton!.hide();
      this.submitButton!.show();
    } else if (index === this.numOfSteps - 1) {
      this.prevButton!.show();
      this.nextButton!.hide();
      this.submitButton!.show();
    } else {
      this.prevButton!.show();
      this.nextButton!.show();
      this.submitButton!.hide();
    }
    this.renderActiveTabContent();
  }

  private isCurrentTabValid(): boolean {
    if (this.checkIfRequiredFieldsAreFilled()) {
      console.log('Required fields are filled');
      this.updateTabValidity(this.activeTabIndex, true);
    }
    return this.tabValidityStates[this.activeTabIndex];
  }

  private checkIfRequiredFieldsAreFilled(): boolean {
    return Object.entries(this.steps[this.activeTabIndex].stateUsed).every(([key, value]) => {
      if (value === 'required') {
        // console.log(key, this.formState[key]);
        // console.log(key, this.formState[key], this.formState);
        const fieldValue = this.formState[key];
        if (fieldValue === undefined || fieldValue === '') {
          //console.log(`Field "${key}" is required but is empty`);
          return false;
        }
        if (typeof fieldValue === 'object') {
          const ans = Object.values(fieldValue).every((val) => val !== undefined && val !== '' && val !== false);
          if (!ans) {
            //console.log(`Field "${key}" is required but contains empty values`);
            return false;
          }
        }
        // //console.log('Field is required and is filled');
      }
      // //console.log('Field is optional or filled');
      return true;
    });
  }

  private updateTabValidity(index: number, isValid: boolean): void {
    this.tabValidityStates[index] = isValid;
  }

  /**
   * Updates the form state.
   *
   * @param keyOrState - The key to update or an object containing multiple key-value pairs to update.
   * @param value - The value to update for the given key (optional).
   *
   * Usage examples:
   *
   * // Updating a single key-value pair
   * updateFormState('username', 'newUsername');
   *
   * // Updating multiple key-value pairs with an object
   * updateFormState({ username: 'newUsername', email: 'newEmail@example.com' });
   *
   * // Updating a nested object for a specific key
   * updateFormState('address', { street: '123 Main St', city: 'Anytown' });
   */
  private updateFormState(keyOrState: string | { [key: string]: any }, value?: any): void {
    // console.log('Update form state', keyOrState, value);
    if (typeof keyOrState === 'string') {
      if (this.formState[keyOrState] instanceof Object && value instanceof Object) {
        // console.log('type 1', keyOrState, value);
        this.formState[keyOrState] = { ...this.formState[keyOrState], ...value };
      } else {
        // console.log('type 2', keyOrState, value);
        this.formState[keyOrState] = value;
      }
    } else {
      for (const [key, val] of Object.entries(keyOrState)) {
        if (this.formState[key] instanceof Object && val instanceof Object) {
          // console.log('type 3', key, val);
          this.formState[key] = { ...this.formState[key], ...val };
        } else {
          // console.log('type 4', key, val);
          this.formState[key] = val;
        }
      }
    }
    //console.log('Updated form state:', this.formState);
    if (this.checkIfRequiredFieldsAreFilled()) {
      //console.log('Required fields are filled');
      this.updateTabValidity(this.activeTabIndex, true);
    } else {
      //console.log('Required fields are not filled');
      this.updateTabValidity(this.activeTabIndex, false);
    }
  }

  renderActiveTabContent(): void {
    if (this.contentElement) {
      //console.log('Render Active Tab Content');
      this.contentElement.innerHTML = '';
      this.steps[this.activeTabIndex].step.render(this.contentElement, this.formState, (newState: any) => this.updateFormState(newState));
    }
  }
}

export default MultistepForm;
