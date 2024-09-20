import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { FileInputBase } from '@/components/input_file/input.file';
import { TextAreaBase } from '@/components/test_area/textArea.base';
import './Expertise.scss';
import { Step } from '@/components/multistepForm/multistep-form';

class Expertise implements Step {
  private skillsField?: TextAreaBase = new TextAreaBase({
    label: 'Skills and Proficiencies',
    placeholder: 'Enter your skills and proficiencies',
    onChange: (value) => {
      this.updateParentState!({ skills: value });
    },
  });
  private certificateField?: TextAreaBase = new TextAreaBase({
    label: 'Certificate',
    placeholder: 'Enter your certificate',
    onChange: (value) => {
      this.updateParentState!({ certificate: value });
    },
  });
  private referenceField?: TextAreaBase = new TextAreaBase({
    label: 'Reference',
    placeholder: 'Enter your reference',
    onChange: (value) => {
      this.updateParentState!({ reference: value });
    },
  });
  private fileInput?: FileInputBase = new FileInputBase({
    label: 'Upload File',
    onChange: (value) => {
      this.updateParentState!({ file: value });
    },
  });
  private updateParentState!: (newState: any) => void;

  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'div', 'expertise-details', {}, (q) => {
      $(q, 'div', 'form-field', {}, (q) => {
        this.skillsField!.render(q);
        this.skillsField?.setValue(state.skills);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.certificateField!.render(q);
        this.certificateField?.setValue(state.certificate);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.referenceField!.render(q);
        this.referenceField?.setValue(state.reference);
      });
      $(q, 'div', 'form-field-container', {}, (q) => {
        $(q, 'div', 'form-field', {}, (q) => {
          this.fileInput!.render(q);
          this.fileInput?.setValue(state.file);
        });
      });
    });
  }
}

export default Expertise;
