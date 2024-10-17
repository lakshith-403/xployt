import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { FileInputBase } from './../../../../components/input_file/input.file';
import { TextAreaBase } from './../../../../components/test_area/textArea.base';
import { TagInput } from '@components/text_field/tagInput/tagInput';
import { expertiseTags, platformSpecializationTags } from './data';
import './Expertise.scss';

import { Step } from './../../../../components/multistepForm/multistep-form';

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
      this.updateParentState!({ certificates: value });
    },
  });
  private referenceField?: TextAreaBase = new TextAreaBase({
    label: 'Reference',
    placeholder: 'Enter your reference',
    onChange: (value) => {
      this.updateParentState!({ references: value });
    },
  });
  private fileInput?: FileInputBase = new FileInputBase({
    label: 'Upload CV',
    onChange: (value) => {
      this.updateParentState!({ file: value });
    },
  });
  private releventExperienceField?: TextAreaBase = new TextAreaBase({
    label: 'Relevant Experience',
    placeholder: 'E.g., experience in reviewing reports, conducting audits, security assessments...',
    onChange: (value) => {
      this.updateParentState!({ relevantExperience: value });
    },
  });
  private areaOfExpertise = new TagInput({
    suggestions: expertiseTags,
    label: 'Areas of Expertise',
    placeholder: 'Add an area of expertise',
    onChange: (value) => {
      this.updateParentState!({ areaOfExpertise: value });
    },
  });
  private updateParentState!: (newState: any) => void;

  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'section', 'Security Level Payment', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Security Level Payment');

      $(q, 'div', 'payment-details', {}, (q) => {
        this.areaOfExpertise.render(q);
        $(q, 'div', 'form-field', {}, (q) => {
          this.releventExperienceField!.render(q);
        });
      });
    });

    $(q, 'section', 'Validator Capabilities', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Validator Capabilities');
      $(q, 'div', 'expertise-details', {}, (q) => {
        $(q, 'div', 'form-field', {}, (q) => {
          this.skillsField!.render(q);
          this.skillsField?.setValue(state.skills);
        });
        $(q, 'div', 'form-field', {}, (q) => {
          this.certificateField!.render(q);
          this.certificateField?.setValue(state.certificates);
        });
        $(q, 'div', 'form-field', {}, (q) => {
          this.referenceField!.render(q);
          this.referenceField?.setValue(state.references);
        });
        $(q, 'div', 'form-field-container', {}, (q) => {
          $(q, 'div', 'form-field', {}, (q) => {
            this.fileInput!.render(q);
          });
        });
      });
    });
  }
}

export default Expertise;
