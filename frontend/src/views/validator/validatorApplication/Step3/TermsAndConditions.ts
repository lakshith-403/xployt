import { Step } from './../../../../components/multistepForm/multistep-form';
import { TextField } from './../../../../components/text_field/base';
import { Checkbox } from './../../../../components/checkboxManager/checkbox';

import { Quark, QuarkFunction as $ } from './../../../../ui_lib/quark';

import './TermsAndConditions.scss';

export class TermsAndConditions implements Step {
  private updateParentState?: (newState: any) => void;
  private commentsField?: TextField;
  private acceptTermsCheckbox?: Checkbox;
  private joinYourCheckbox?: Checkbox;
  private securityPolicy?: Checkbox;

  constructor() {
    this.commentsField = new TextField({
      label: 'Additional Comments',
      placeholder: 'Enter any additional comments',
      onChange: (value) => {
        this.updateParentState!({ comments: value });
      },
    });

    this.acceptTermsCheckbox = new Checkbox({
      label: 'I accept the terms and conditions',
      checked: false,
      onChange: (checked) => {
        this.updateParentState!({ termsAndConditions: { 0: checked } });
      },
    });
    this.joinYourCheckbox = new Checkbox({
      label: 'I join at my own risk',
      checked: false,
      onChange: (checked) => {
        this.updateParentState!({ termsAndConditions: { 1: checked } });
      },
    });
    this.securityPolicy = new Checkbox({
      label: 'I accept the security policy',
      checked: false,
      onChange: (checked) => {
        this.updateParentState!({ termsAndConditions: { 2: checked } });
      },
    });
  }

  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'div', 'terms-and-conditions', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Terms and Conditions');
      $(q, 'p', '', {}, 'Please read and accept the terms and conditions to proceed.');

      $(q, 'div', 'policies', {}, (q) => {
        $(q, 'div', 'form-field', {}, (q) => {
          this.acceptTermsCheckbox!.render(q);
          this.acceptTermsCheckbox?.setChecked(state.termsAndConditions[0]);
        });

        $(q, 'div', 'form-field', {}, (q) => {
          this.joinYourCheckbox!.render(q);
          this.joinYourCheckbox?.setChecked(state.termsAndConditions[1]);
        });

        $(q, 'div', 'form-field', {}, (q) => {
          this.securityPolicy!.render(q);
          this.securityPolicy?.setChecked(state.termsAndConditions[2]);
        });

        $(q, 'div', 'form-field', {}, (q) => {
          this.commentsField!.render(q);
          this.commentsField?.setValue(state.comments);
        });
      });
    });
  }

  private updateState(state: any): void {
    this.updateParentState!(state);
  }
}
