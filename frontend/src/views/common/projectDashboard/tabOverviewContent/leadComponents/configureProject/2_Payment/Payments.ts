import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { FormTextField } from '@components/text_field/form.text_field';
import { FileInputBase } from '@components/input_file/input.file';
import { TagInput } from '@components/text_field/tagInput/tagInput';
import { Step } from '@components/multistepForm/multistep-form';
import { criticalLevelTags, highLevelTags, mediumLevelTags, lowLevelTags, informativeLevelTags } from './data';
// import { FormRadioButton } from '@components/text_field/form.radio_button';
class Payments implements Step {
  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'div', 'payments', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Payments');

      this.renderFieldFullWidth(q, this.fields.critical, state.critical);
      this.renderFieldFullWidth(q, this.fields.criticalFunding, state.criticalFunding, 'mb-2');
      this.renderFieldFullWidth(q, this.fields.high, state.high);
      this.renderFieldFullWidth(q, this.fields.highFunding, state.highFunding, 'mb-2');
      this.renderFieldFullWidth(q, this.fields.medium, state.medium);
      this.renderFieldFullWidth(q, this.fields.mediumFunding, state.mediumFunding, 'mb-2');
      this.renderFieldFullWidth(q, this.fields.low, state.low);
      this.renderFieldFullWidth(q, this.fields.lowFunding, state.lowFunding, 'mb-2');
      this.renderFieldFullWidth(q, this.fields.informative, state.informative);
      this.renderFieldFullWidth(q, this.fields.informativeFunding, state.informativeFunding);
      // this.renderFieldFullWidth(q, this.fields.visibility, state.visibility);
      this.renderFieldFullWidth(q, this.fields.attachments, state.attachments);
    });
  }

  private renderFieldFullWidth(q: Quark, field: FormTextField | TagInput, value: any, className?: string): void {
    // console.log('Rendering field:', field); // Check if field is defined
    if (field) {
      $(q, 'div', `${className}`, {}, (q) => {
        field.render(q);
        if (field instanceof TagInput) {
          // console.log('Adding tags:', value);
          field.addTags(value);
        } else if (field instanceof FormTextField) {
          field.setValue(value);
        }
        field.addClass('w-100');
      });
    } else {
      console.error('Field is undefined');
    }
  }
  // private renderCustomField(q: Quark, field: FormTextField, value: any, widthFraction: number): void {
  //   $(q, 'div', 'form-field', {}, (q) => {
  //     field.render(q);
  //     field.setValue(value);
  //     field.addClass(`w-${widthFraction}`);
  //   });
  // }

  private fields: { [key: string]: any } = {
    criticalFunding: new FormTextField({ label: 'Bounty for Critical', placeholder: 'The bounty for Critical bugs', name: 'criticalFunding', type: 'number' }),
    highFunding: new FormTextField({ label: 'Bounty for High', placeholder: 'The bounty for High bugs', name: 'highFunding', type: 'number' }),
    mediumFunding: new FormTextField({ label: 'Bounty for Medium', placeholder: 'The bounty for Medium bugs', name: 'mediumFunding', type: 'number' }),
    lowFunding: new FormTextField({ label: 'Bounty for Low', placeholder: 'The bounty for Low bugs', name: 'lowFunding', type: 'number' }),
    informativeFunding: new FormTextField({ label: 'Bounty for Informative', placeholder: 'The bounty for Informative bugs', name: 'informativeFunding', type: 'number' }),
    critical: new TagInput({ label: 'Critical', placeholder: 'Select areas considered of critical risk from those given', name: 'critical', suggestions: criticalLevelTags }),
    high: new TagInput({ label: 'High', placeholder: 'Select areas considered of high risk from those given', name: 'high', suggestions: highLevelTags }),
    medium: new TagInput({ label: 'Medium', placeholder: 'Select areas considered of medium risk from those given', name: 'medium', suggestions: mediumLevelTags }),
    low: new TagInput({ label: 'Low', placeholder: 'Select areas considered of low risk from those given', name: 'low', suggestions: lowLevelTags }),
    informative: new TagInput({ label: 'Informative', placeholder: 'Select areas considered of informative risk from those given', name: 'informative', suggestions: informativeLevelTags }),
    // visibility: new FormRadioButton({ label: 'Visibility', options: ['Public', 'Private'], name: 'visibility' }),
    attachments: new FileInputBase({ label: 'Attachments', name: 'attachments' }),
  };

  constructor() {
    for (const field of Object.values(this.fields)) {
      field.setOnChange((value: string) => {
        const keys = field.name.split('.');
        // console.log(keys);
        if (keys.length > 1) {
          const nestedState: { [key: string]: any } = keys.reduceRight((acc: any, key: string) => ({ [key]: acc }), value);
          // console.log(nestedState);
          this.updateState(nestedState);
        } else {
          this.updateState({ [keys[0]]: value });
        }
      });
    }
  }

  private updateParentState!: (newState: any) => void;

  private updateState(state: any): void {
    this.updateParentState!(state);
  }
}

export default Payments;
