import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { TextField } from '../../../../components/text_field/base';
import './Preferences.scss';
import { Step } from '@/components/multistepForm/multistep-form';

class Preferences implements Step {
  title = 'Preferences';
  private nameField?: TextField;
  private descriptionField: TextField = new TextField({ label: 'Project Description', onChange: () => this.checkValidity() });
  private onValidityChange?: (isValid: boolean) => void;
  private updateParentState?: (newState: any) => void;

  render(q: Quark, state: any, onValidityChange: (isValid: boolean) => void, updateParentState: (newState: any) => void): void {
    this.onValidityChange = onValidityChange;
    this.updateParentState = updateParentState;

    $(q, 'div', 'project-details', {}, (q) => {
      $(q, 'h2', '', {}, 'Project Details');

      $(q, 'div', 'form-field', {}, (q) => {
        this.nameField = new TextField({ label: 'Project Name', onChange: () => this.checkValidity() });
        this.nameField.render(q);
      });

      $(q, 'div', 'form-field', {}, (q) => {
        this.descriptionField.render(q);
      });
    });

    // Initial validity check
    this.checkValidity();
  }

  private checkValidity(): void {
    const isValid = this.nameField!.getValue().trim() !== '' && this.descriptionField.getValue().trim() !== '';
    this.onValidityChange!(isValid);
    this.updateParentState!({ projectName: this.nameField!.getValue(), projectDescription: this.descriptionField.getValue() });
  }
}

export default Preferences;
