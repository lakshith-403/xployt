import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { ButtonType } from '../button/base';
import { FormButton } from '../button/form.button';
import './multistep-form.scss';

export abstract class Step {
  abstract render: (q: Quark, formState: any, onValidityChange: (isValid: boolean) => void, updateParentState: (newState: any) => void) => void;
  // abstract checkValidity: () => void;
}

interface Steps {
  title: string;
  step: Step;
}

class MultistepForm {
  steps: Steps[];
  activeTabIndex: number;
  contentElement!: HTMLElement;
  tabsButtons!: HTMLElement;
  private stage: number = 0;
  private nextButton: FormButton | null = null;
  private prevButton: FormButton | null = null;
  private tabValidityStates: boolean[] = [];
  private formState: any = {};

  constructor(steps: Steps[], formState: any) {
    this.steps = steps;
    this.activeTabIndex = 0;
    this.tabValidityStates = new Array(steps.length).fill(false);
    this.formState = formState;
  }

  render(q: Quark): void {
    $(q, 'div', 'tabs-container', {}, (q) => {
      $(q, 'div', 'tabs-header', {}, (q) => {
        this.tabsButtons = $(q, 'div', 'tabs-header', {}, (q) => {
          this.steps.forEach((step, index) => {
            $(q, 'button', 'tab-button', { onclick: () => this.jumpToTab(index) }, (q) => {
              $(q, 'span', 'dot', {}, step.title);
            });
          });
        });
      });

      $(q, 'div', 'tabs-content', {}, (q) => {
        this.contentElement = q;
        this.renderActiveTabContent();
      });

      // this.nextButton = $(q, 'button', 'next-button', { onclick: () => this.nextTab() }, 'Next') as HTMLButtonElement;
      this.nextButton = new FormButton({
        label: 'Next',
        onClick: () => this.nextTab(),
        type: ButtonType.PRIMARY,
      });
      this.nextButton.render(q);

      this.prevButton = new FormButton({
        label: 'Prev',
        onClick: () => this.prevTab(),
        type: ButtonType.SECONDARY,
      });
      this.prevButton.render(q);
      this.prevButton.hide();
    });

    this.tabsButtons.children[this.activeTabIndex].classList.add('selected');
  }

  nextTab(): void {
    console.log('Next Tab Clicked');
    if (this.activeTabIndex + 1 <= this.stage) {
      this.switchTab(this.activeTabIndex + 1);
    } else if (this.isCurrentTabValid()) {
      this.stage++;
      this.switchTab(this.activeTabIndex + 1);
    }
  }

  prevTab(): void {
    console.log('Prev Tab Clicked');
    if (this.activeTabIndex > 0) {
      this.switchTab(this.activeTabIndex - 1);
    }
  }

  jumpToTab(index: number): void {
    if (index >= this.stage) {
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
    } else {
      this.prevButton!.show();
    }
    this.renderActiveTabContent();
  }

  private isCurrentTabValid(): boolean {
    return this.tabValidityStates[this.activeTabIndex];
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
  }

  renderActiveTabContent(): void {
    if (this.contentElement) {
      console.log('Render Active Tab Content');
      this.contentElement.innerHTML = '';
      this.steps[this.activeTabIndex].step.render(
        this.contentElement,
        this.formState,
        (isValid: boolean) => this.updateTabValidity(this.activeTabIndex, isValid),
        (newState: any) => this.updateFormState(newState)
      );
    }
  }
}

export default MultistepForm;
