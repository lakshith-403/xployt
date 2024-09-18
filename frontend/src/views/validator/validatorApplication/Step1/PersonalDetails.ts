import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { TextField } from '../../../../components/text_field/base';
import './PersonalDetails.scss';
import { Step } from '@/components/multistepForm/multistep-form';

class PersonalDetails implements Step {
  title = 'Personal Details';
  private nameField: TextField = new TextField({ label: 'Name', onChange: () => this.updateState() });
  private emailField: TextField = new TextField({ label: 'Email', onChange: () => this.updateState() });
  private mobileField: TextField = new TextField({ label: 'Mobile', onChange: () => this.updateState() });
  private countryField: TextField = new TextField({ label: 'Country', onChange: () => this.updateState() });
  private linkedinField: TextField = new TextField({ label: 'LinkedIn', onChange: () => this.updateState() });
  private dateOfBirthField: TextField = new TextField({ label: 'Date of Birth', onChange: () => this.updateState() });
  private onValidityChange?: (isValid: boolean) => void;
  private updateParentState?: (newState: any) => void;

  render(q: Quark, state: any, onValidityChange: (isValid: boolean) => void, updateParentState: (newState: any) => void): void {
    console.log('PersonalDetails render');
    console.log(state);
    this.onValidityChange = onValidityChange;
    this.updateParentState = updateParentState;

    $(q, 'div', 'project-details', {}, (q) => {
      $(q, 'h2', '', {}, 'Personal Details');

      $(q, 'div', 'form-field', {}, (q) => {
        this.nameField.render(q);
        this.nameField.setValue(state.name);
      });

      $(q, 'div', 'form-field', {}, (q) => {
        this.emailField.render(q);
        this.emailField.setValue(state.email);
      });

      // $(q, 'div', 'form-field', {}, (q) => {
      //   this.mobileField.setValue(state.mobile);
      //   this.mobileField.render(q);
      // });
    });

    // Initial validity check
    this.checkValidity();
  }
  private updateState(): void {
    this.updateParentState!({ name: this.nameField!.getValue(), email: this.emailField.getValue() });
    this.checkValidity();
  }
  private checkValidity(): void {
    const isValid = this.nameField!.getValue().trim() !== '' && this.emailField.getValue().trim() !== '';
    this.onValidityChange!(isValid);
  }
}

export default PersonalDetails;
