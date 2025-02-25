import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { FileInputBase } from './../../../../components/input_file/input.file';
import { TextAreaBase } from './../../../../components/test_area/textArea.base';
import { TagInput } from '@components/text_field/tagInput/tagInput';
import { expertiseTags, platformSpecializationTags } from './data';
import './Expertise.scss';

import { Step } from './../../../../components/multistepForm/multistep-form';

class Expertise implements Step {
  private updateParentState!: (newState: any) => void;

  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'section', 'Security Level Payment', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Security Level Payment');

      $(q, 'div', 'payment-details', {}, (q) => {
        this.fields.areaOfExpertise.render(q);
        $(q, 'div', 'form-field', {}, (q) => {
          this.fields.relevantExperience.render(q);
        });
      });
    });

    $(q, 'section', 'Validator Capabilities', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Validator Capabilities');
      $(q, 'div', 'expertise-details', {}, (q) => {
        $(q, 'div', 'form-field', {}, (q) => {
          this.fields.skills.render(q);
          this.fields.skills.setValue(state.skills);
        });
        $(q, 'div', 'form-field', {}, (q) => {
          this.fields.certificates.render(q);
          this.fields.certificates.setValue(state.certificates);
        });
        $(q, 'div', 'form-field', {}, (q) => {
          this.fields.references.render(q);
          this.fields.references.setValue(state.references);
        });
        $(q, 'div', 'form-field-container', {}, (q) => {
          $(q, 'div', 'form-field', {}, (q) => {
            this.fields.file.render(q);
          });
        });
      });
    });
  }

  private fields: { [key: string]: any } = {
    skills: new TextAreaBase({
      label: 'Skills and Proficiencies',
      placeholder: 'Enter your skills and proficiencies as a comma separated list',
      name: 'skills',
    }),
    certificates: new TextAreaBase({
      label: 'Certificate',
      placeholder: 'Enter your certificate as a comma separated list',
      name: 'certificates',
    }),
    references: new TextAreaBase({
      label: 'Reference',
      placeholder: 'Enter your reference as a comma separated list',
      name: 'references',
    }),
    file: new FileInputBase({
      label: 'Upload CV',
      name: 'file',
    }),
    relevantExperience: new TextAreaBase({
      label: 'Relevant Experience',
      placeholder: 'Enter your relevant experience as a comma separated list (eg: "Experience 1, Experience 2, Experience 3")',
      name: 'relevantExperience',
    }),
    areaOfExpertise: new TagInput({
      suggestions: expertiseTags,
      label: 'Areas of Expertise',
      placeholder: 'Select areas of expertise from those given',
      name: 'areaOfExpertise',
    }),
  };

  constructor() {
    console.log('Console in');
    for (const field of Object.values(this.fields)) {
      console.log(field);
      field.setOnChange((value: string) => {
        const keys = field.name.split('.');
        // console.log(keys);
        if (keys.length > 1) {
          const nestedState: { [key: string]: any } = keys.reduceRight((acc: any, key: string) => ({ [key]: acc }), value);
          this.updateParentState(nestedState);
        } else {
          this.updateParentState({ [keys[0]]: value });
        }
      });
    }
  }
}

export default Expertise;
