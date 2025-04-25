import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { FileInputBase } from './../../../../components/input_file/input.file';
import { TextAreaBase } from './../../../../components/test_area/textArea.base';
import { TagInput } from '@components/text_field/tagInput/tagInput';
import { expertiseTags } from './data';
import './Expertise.scss';

import { Step } from './../../../../components/multistepForm/multistep-form';
import {isValidFileSizeStrict, isValidFileType, validateField} from "@components/multistepForm/validationUtils";
import {FieldErrorMessage} from "@views/hacker/VulnerabilityReport/VulnerabilityReportForm";

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
        $(q, 'div', 'form-field', {id: "certificates"}, (q) => {
          this.fields.certificates.render(q);
          const fileInputContainer = document.querySelector('#certificates') as HTMLElement;
          const fileInputElement = fileInputContainer.querySelector('input[type="file"]') as HTMLInputElement;

          state.file = fileInputElement.value;

          fileInputElement.addEventListener('change', () => {
            this.handleFileUploads(fileInputElement, 'cert');
          });
        });
        $(q, 'div', 'form-field', {}, (q) => {
          this.fields.references.render(q);
        });
        $(q, 'div', 'form-field-container', {id: "cv"}, (q) => {
          $(q, 'div', 'form-field', {}, (q) => {
            this.fields.file.render(q);

            const fileInputContainer = document.querySelector('#cv') as HTMLElement;
            const fileInputElement = fileInputContainer.querySelector('input[type="file"]') as HTMLInputElement;

            state.certificates = fileInputElement.value;

            fileInputElement.addEventListener('change', () => {
              this.handleFileUploads(fileInputElement, 'cv');
            });

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
    certificates: new FileInputBase({
      label: 'Enter your certificates as a comma separated list',
      name: 'certificates',
    }),
    references: new TextAreaBase({
      label: 'References',
      placeholder: 'Enter your references as a comma separated list',
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

  private files: File[][];
  private handleFileUploads(fileInput: HTMLInputElement, type: string): void {
    const fieldFiles = fileInput.files;
    console.log("Files,", fieldFiles)
    if (!fieldFiles) return;

    this.addFiles(fieldFiles, type);
  }

  private addFiles(fieldFiles: FileList, type: string): void {
    const index = type == "cv" ? 1: 0;
    this.files[index] = Array.from(fieldFiles);
  }

  constructor(files: File[][]) {
    this.files = files;
    console.log('Console in');
    // for (const field of Object.values(this.fields)) {
    //   console.log(field);
    //   field.setOnChange((value: string) => {
    //     const keys = field.name.split('.');
    //     // console.log(keys);
    //     if (keys.length > 1) {
    //       const nestedState: { [key: string]: any } = keys.reduceRight((acc: any, key: string) => ({ [key]: acc }), value);
    //       this.updateParentState(nestedState);
    //     } else {
    //       this.updateParentState({ [keys[0]]: value });
    //     }
    //   });
    // }
  }
}

export default Expertise;
