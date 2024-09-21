import { Step } from './../../../../components/multistepForm/multistep-form';
import { TextField } from './../../../../components/text_field/base';
import { Quark, QuarkFunction as $ } from './../../../../ui_lib/quark';

import './TermsAndConditions.scss';

export class TermsAndConditions implements Step {
  private updateParentState?: (newState: any) => void;
  constructor() {}

  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'div', 'project-details', {}, (q) => {
      $(q, 'h2', '', {}, 'Project Details');
    });
  }
  private updateState(state: any): void {
    this.updateParentState!(state);
  }
}
