import { Step } from '@components/multistepForm/multistep-form';
import { TextField } from '@components/text_field/base';
import { Checkbox } from '@components/checkboxManager/checkbox';

import { Quark, QuarkFunction as $ } from './../../../../ui_lib/quark';

import './TermsAndConditions.scss';

export class TermsAndConditions implements Step {
  private updateParentState?: (newState: any) => void;
  private commentsField?: TextField;
  private acceptTermsCheckbox?: Checkbox;
  private joinYourCheckbox?: Checkbox;
  private privacyPolicy?: Checkbox;

  constructor() {
    this.commentsField = new TextField({
      label: 'Additional Comments',
      placeholder: 'Enter any additional comments',
      onChange: (value) => {
        this.updateParentState!({ comments: value });
      },
    });

    this.acceptTermsCheckbox = new Checkbox({
      label: 'I have read and accept the terms and conditions in the Validator Application Agreement.',
      checked: false,
      onChange: (checked) => {
        this.updateParentState!({ termsAndConditions: { 0: checked } });
      },
    });
    this.privacyPolicy = new Checkbox({
      label: "I have read and accept Xployt Co's Privacy Policy.",
      checked: false,
      onChange: (checked) => {
        this.updateParentState!({ termsAndConditions: { 2: checked } });
      },
    });
    this.joinYourCheckbox = new Checkbox({
      label: 'I acknowledge the potential risks involved and voluntarily choose to apply to this position.',
      checked: false,
      onChange: (checked) => {
        this.updateParentState!({ termsAndConditions: { 1: checked } });
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
          const agreement = $(q, 'p', 'agreement-link text-small cursor-pointer text-light-green', {}, 'View the Validator Application Agreement');
          agreement.addEventListener('click', (e) => {
            e.preventDefault();
            const url = '/home/user-agreement/validator';
            window.open(url, '_blank');
          })
        });

        $(q, 'div', 'form-field', {}, (q) => {
          this.privacyPolicy!.render(q);
          this.privacyPolicy?.setChecked(state.termsAndConditions[2]);
          const agreement = $(q, 'p', 'agreement-link text-small cursor-pointer text-light-green', {}, 'View the Privacy Policy');
          agreement.addEventListener('click', (e) => {
            e.preventDefault();
            const url = '/home/privacy-policy/validator';
            window.open(url, '_blank');
          })
        });

        $(q, 'div', 'form-field', {}, (q) => {
          this.joinYourCheckbox!.render(q);
          this.joinYourCheckbox?.setChecked(state.termsAndConditions[1]);
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
