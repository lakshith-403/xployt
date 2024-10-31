import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { FormTextField } from '../../../../components/text_field/form.text_field';
import './PersonalDetails.scss';
import { Step } from './../../../../components/multistepForm/multistep-form';

class PersonalDetails implements Step {
  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'div', 'personal-details', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Personal Details');

      this.renderFieldFullWidth(q, this.fields.name, state.name);
      this.renderFieldFullWidth(q, this.fields.email, state.email);
      this.renderFieldFullWidth(q, this.fields.mobile, state.mobile);
      this.renderFieldFullWidth(q, this.fields.country, state.country);
      this.renderFieldFullWidth(q, this.fields.linkedin, state.linkedin);

      $(q, 'div', 'dob', {}, (q) => {
        $(q, 'span', '', {}, 'Date of Birth *');
        $(q, 'div', 'dob-fields', {}, (q) => {
          this.renderCustomField(q, this.fields.dobDay, state.dateOfBirth?.day, 1 / 3);
          this.renderCustomField(q, this.fields.dobMonth, state.dateOfBirth?.month, 1 / 3);
          this.renderCustomField(q, this.fields.dobYear, state.dateOfBirth?.year, 1 / 3);
        });
      });
      // this.renderFieldFullWidth(q, this.fields.dobYearTest, '');
    });
  }

  private renderFieldFullWidth(q: Quark, field: FormTextField, value: any): void {
    $(q, 'div', 'form-field', {}, (q) => {
      field.render(q);
      field.setValue(value);
      field.addClass('w-full');
    });
  }

  private fields: { [key: string]: FormTextField } = {
    name: new FormTextField({ label: 'Name *', placeholder: 'Enter your name', name: 'name' }),
    email: new FormTextField({ label: 'Email *', placeholder: 'Enter your email', name: 'email' }),
    mobile: new FormTextField({ label: 'Mobile *', placeholder: 'Enter your mobile number', name: 'mobile' }),
    country: new FormTextField({ label: 'Country *', placeholder: 'Select your country', name: 'country' }),
    linkedin: new FormTextField({ label: 'LinkedIn *', placeholder: 'Enter your LinkedIn profile URL', name: 'linkedin' }),
    dobDay: new FormTextField({ label: '', placeholder: 'DD', name: 'dateOfBirth.day' }),
    dobMonth: new FormTextField({ label: '', placeholder: 'MM', name: 'dateOfBirth.month' }),
    dobYear: new FormTextField({ label: '', placeholder: 'YYYY', name: 'dateOfBirth.year' }),
    // dobYearTest: new FormTextField({ label: '', placeholder: 'YYYY', name: 'dateOfBirth.month.year.day' }),
  };

  constructor() {
    for (const field of Object.values(this.fields)) {
      field.onChange = (value) => {
        const keys = field.name.split('.');
        console.log(keys);
        if (keys.length > 1) {
          const nestedState = keys.reduceRight<any>((acc, key) => ({ [key]: acc }), value);
          // console.log(nestedState);
          this.updateState(nestedState);
        } else {
          this.updateState({ [keys[0]]: value });
        }
      };
    }
  }

  private updateParentState!: (newState: any) => void;

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
