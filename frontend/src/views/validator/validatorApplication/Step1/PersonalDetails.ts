import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { FormTextField } from '../../../../components/text_field/form.text_field';
import './PersonalDetails.scss';
import { Step } from './../../../../components/multistepForm/multistep-form';

class PersonalDetails implements Step {
  private nameField: FormTextField = new FormTextField({ label: 'Name *', placeholder: 'Enter your name', onChange: (value) => this.updateState({ name: value }) });
  private emailField: FormTextField = new FormTextField({ label: 'Email *', placeholder: 'Enter your email', onChange: (value) => this.updateState({ email: value }) });
  private mobileField: FormTextField = new FormTextField({ label: 'Mobile *', placeholder: 'Enter your mobile number', onChange: (value) => this.updateState({ mobile: value }) });
  private countryField: FormTextField = new FormTextField({ label: 'Country *', placeholder: 'Select your country', onChange: (value) => this.updateState({ country: value }) });
  private linkedinField: FormTextField = new FormTextField({
    label: 'LinkedIn *',
    placeholder: 'Enter your LinkedIn profile URL',
    onChange: (value) => this.updateState({ linkedin: value }),
  });
  private dobDayField: FormTextField = new FormTextField({ label: '', placeholder: 'DD', onChange: (value) => this.updateState({ dateOfBirth: { day: value } }) });
  private dobMonthField: FormTextField = new FormTextField({ label: '', placeholder: 'MM', onChange: (value) => this.updateState({ dateOfBirth: { month: value } }) });
  private dobYearField: FormTextField = new FormTextField({ label: '', placeholder: 'YYYY', onChange: (value) => this.updateParentState({ dateOfBirth: { year: value } }) });

  private updateParentState!: (newState: any) => void;

  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'div', 'personal-details', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Personal Details');

      this.renderFieldFullWidth(q, this.nameField, state.name);
      this.renderFieldFullWidth(q, this.emailField, state.email);
      this.renderFieldFullWidth(q, this.mobileField, state.mobile);
      this.renderFieldFullWidth(q, this.countryField, state.country);
      this.renderFieldFullWidth(q, this.linkedinField, state.linkedin);

      $(q, 'div', 'dob', {}, (q) => {
        $(q, 'span', '', {}, 'Date of Birth *');
        $(q, 'div', 'dob-fields', {}, (q) => {
          this.renderCustomField(q, this.dobDayField, state.dateOfBirth?.day, 1 / 3);
          this.renderCustomField(q, this.dobMonthField, state.dateOfBirth?.month, 1 / 3);
          this.renderCustomField(q, this.dobYearField, state.dateOfBirth?.year, 1 / 3);
        });
      });
    });
  }

  private renderFieldFullWidth(q: Quark, field: FormTextField, value: any): void {
    $(q, 'div', 'form-field', {}, (q) => {
      field.render(q);
      field.setValue(value);
      field.addClass('w-full');
    });
  }

  private renderCustomField(q: Quark, field: FormTextField, value: any, widthFraction: number): void {
    $(q, 'div', 'form-field', {}, (q) => {
      field.render(q);
      field.setValue(value);
      field.addClass(`w-${widthFraction}`);
    });
  }

  private updateState(state: any): void {
    this.updateParentState!(state);
  }
}

export default PersonalDetails;
