import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { ButtonType } from '../button/base';
import { FormButton } from '../button/form.button';
import './multistep-form.scss';

export abstract class Step {
  abstract render: (q: Quark, formState: any, updateParentState: (newState: any) => void) => void;
}

interface Steps {
  title: string;
  stateUsed: { [key: string]: 'optional' | 'required' };
  step: Step;
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

  constructor(steps: Steps[], formState: any, lastAction: 'Submit' | 'Apply', onSubmit: (formState: any) => void) {
    this.steps = steps;
    this.activeTabIndex = 0;
    this.tabValidityStates = new Array(steps.length).fill(false);
    this.formState = formState;
    this.numOfSteps = steps.length;
    this.lastAction = lastAction;
    this.onSubmit = onSubmit;
  }

  render(q: Quark): void {
    $(q, 'div', 'multistep-form', {}, (q) => {
      this.tabsButtons = $(q, 'div', 'tabs-header', {}, (q) => {
        this.steps.forEach((step, index) => {
          $(q, 'button', 'tab-button', { onclick: () => this.jumpToTab(index) }, (q) => {
            $(q, 'span', 'dot', {}, step.title);
          });
        });
      });

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
          type: ButtonType.PRIMARY,
        });
        this.nextButton.render(q);
        this.nextButton.setClass('next-button');

        this.submitButton = new FormButton({
          label: 'Submit',
          onClick: () => this.onSubmit(this.formState),
          type: ButtonType.PRIMARY,
        });
        this.submitButton.render(q);
        this.submitButton.setClass('submit-button');
        this.submitButton.hide();
      });
    });

    this.tabsButtons.children[this.activeTabIndex].classList.add('selected');
  }

  nextTab(): void {
    console.log('Next Tab Clicked');
    if (this.activeTabIndex + 1 <= this.stage && this.isCurrentTabValid()) {
      this.switchTab(this.activeTabIndex + 1);
    } else if (this.isCurrentTabValid()) {
      this.stage++;
      this.switchTab(this.activeTabIndex + 1);
    } else {
      alert('Please fill in all the required fields.');
    }
  }

  prevTab(): void {
    console.log('Prev Tab Clicked');
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
    if (index === 0) {
      this.prevButton!.hide();
      this.nextButton!.show();
      this.submitButton!.hide();
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
    return this.tabValidityStates[this.activeTabIndex];
  }

  private checkIfRequiredFieldsAreFilled(): boolean {
    return Object.entries(this.steps[this.activeTabIndex].stateUsed).every(([key, value]) => {
      if (value === 'required') {
        const fieldValue = this.formState[key];
        if (fieldValue === undefined || fieldValue === '') {
          // console.log('Field is required but is empty');
          return false;
        }
        if (typeof fieldValue === 'object') {
          // console.log('Field is required but is an object');
          return Object.values(fieldValue).every((val) => val !== undefined && val !== '');
        }
        // console.log('Field is required and is filled');
      }
      // console.log('Field is optional or filled');
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
    console.log('Update form state', keyOrState, value);
    if (typeof keyOrState === 'string') {
      if (this.formState[keyOrState] instanceof Object && value instanceof Object) {
        this.formState[keyOrState] = { ...this.formState[keyOrState], ...value };
      } else {
        this.formState[keyOrState] = value;
      }
    } else {
      for (const [key, val] of Object.entries(keyOrState)) {
        if (this.formState[key] instanceof Object && val instanceof Object) {
          this.formState[key] = { ...this.formState[key], ...val };
        } else {
          this.formState[key] = val;
        }
      }
    }
    console.log('Updated form state:', this.formState);
    if (this.checkIfRequiredFieldsAreFilled()) {
      console.log('Required fields are filled');
      this.updateTabValidity(this.activeTabIndex, true);
    } else {
      console.log('Required fields are not filled');
      this.updateTabValidity(this.activeTabIndex, false);
    }
  }

  renderActiveTabContent(): void {
    if (this.contentElement) {
      console.log('Render Active Tab Content');
      this.contentElement.innerHTML = '';
      this.steps[this.activeTabIndex].step.render(this.contentElement, this.formState, (newState: any) => this.updateFormState(newState));
    }
  }
}

export default MultistepForm;
