import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
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
  private nextButton: HTMLButtonElement | null = null;
  private prevButton: HTMLButtonElement | null = null;
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
            $(q, 'button', 'tab-button', { onclick: () => this.switchTab(index) }, (q) => {
              $(q, 'span', 'dot', {}, step.title);
            });
          });
        });
      });

      $(q, 'div', 'tabs-content', {}, (q) => {
        this.contentElement = q;
        this.renderActiveTabContent();
      });

      this.nextButton = $(q, 'button', 'next-button', { onclick: () => this.nextTab() }, 'Next') as HTMLButtonElement;
      this.prevButton = $(q, 'button', 'prev-button', { onclick: () => this.prevTab() }, 'Prev') as HTMLButtonElement;
      this.prevButton.style.display = 'none';
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

  switchTab(index: number): void {
    console.log('Switch Tab Clicked 2');
    this.tabsButtons.children[this.activeTabIndex].classList.remove('selected');
    this.tabsButtons.children[index].classList.add('selected');
    this.activeTabIndex = index;
    if (index === 0) {
      this.prevButton!.style.display = 'none';
    } else {
      this.prevButton!.style.display = 'block';
    }
    this.renderActiveTabContent();
  }

  private isCurrentTabValid(): boolean {
    return this.tabValidityStates[this.activeTabIndex];
  }

  private updateTabValidity(index: number, isValid: boolean): void {
    this.tabValidityStates[index] = isValid;
  }

  private updateFormState(newState: any): void {
    this.formState = { ...this.formState, ...newState };
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
