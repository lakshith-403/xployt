import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { TextField } from '../../../../components/text_field/base';
import './Expertise.scss';
import { Step } from '@/components/multistepForm/multistep-form';

class Expertise implements Step {
  private nameField?: TextField;
  private descriptionField: TextField = new TextField({
    label: 'Project Description',
    onChange: () => {
      return true;
    },
  });
  private updateParentState?: (newState: any) => void;

  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'div', 'project-details', {}, (q) => {
      $(q, 'h2', '', {}, 'Project Details');

      $(q, 'div', 'form-field', {}, (q) => {
        this.nameField = new TextField({
          label: 'Project Name',
          onChange: () => {
            return true;
          },
        });
        this.nameField.render(q);
      });

      $(q, 'div', 'form-field', {}, (q) => {
        this.descriptionField.render(q);
      });
    });
  }
}

export default Expertise;
