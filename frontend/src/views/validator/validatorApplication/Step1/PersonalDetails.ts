import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { TextField } from '../../../../components/text_field/base';
import './PersonalDetails.scss';
import { Step } from '@/components/multistepForm/multistep-form';

class PersonalDetails implements Step {
  title = 'Personal Details';
  private nameField: TextField = new TextField({ label: 'Name', onChange: (value) => this.updateState({ name: value }) });
  private emailField: TextField = new TextField({ label: 'Email', onChange: (value) => this.updateState({ email: value }) });
  private mobileField: TextField = new TextField({ label: 'Mobile', onChange: (value) => this.updateState({ mobile: value }) });
  private countryField: TextField = new TextField({ label: 'Country', onChange: (value) => this.updateState({ country: value }) });
  private linkedinField: TextField = new TextField({ label: 'LinkedIn', onChange: (value) => this.updateState({ linkedin: value }) });
  private dobDayField: TextField = new TextField({ label: 'Date of Birth', onChange: (value) => this.updateState({ dateOfBirth: value }) });
  private dobMonthField: TextField = new TextField({ label: 'Date of Birth', onChange: (value) => this.updateState({ dateOfBirth: value }) });
  private dobYearField: TextField = new TextField({ label: 'Date of Birth', onChange: (value) => this.updateState({ dateOfBirth: value }) });

  private onValidityChange?: (isValid: boolean) => void;
  private updateParentState?: (newState: any) => void;

  render(q: Quark, state: any, onValidityChange: (isValid: boolean) => void, updateParentState: (newState: any) => void): void {
    this.onValidityChange = onValidityChange;
    this.updateParentState = updateParentState;

    $(q, 'div', 'personal-details', {}, (q) => {
      $(q, 'h2', '', {}, 'Personal Details');

      this.renderField(q, this.nameField, state.name);
      this.renderField(q, this.emailField, state.email);
      this.renderField(q, this.mobileField, state.mobile);
      this.renderField(q, this.countryField, state.country);
      this.renderField(q, this.linkedinField, state.linkedin);

      $(q, 'div', 'dob', {}, (q) => {
        this.renderField(q, this.dobDayField, state.dateOfBirth?.day);
        this.renderField(q, this.dobMonthField, state.dateOfBirth?.month);
        this.renderField(q, this.dobYearField, state.dateOfBirth?.year);
      });
    });

    this.checkValidity();
  }

  private renderField(q: Quark, field: TextField, value: any): void {
    $(q, 'div', 'form-field', {}, (q) => {
      field.render(q);
      field.setValue(value);
    });
  }

  private updateState(state: any): void {
    this.updateParentState!(state);
    this.checkValidity();
  }

  private checkValidity(): void {
    const isValid = this.nameField.getValue().trim() !== '' && this.emailField.getValue().trim() !== '';
    this.onValidityChange!(isValid);
  }
}

export default PersonalDetails;
