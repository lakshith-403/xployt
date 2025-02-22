import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { FormTextField } from '@components/text_field/form.text_field';
import { FormRadioButton } from '@components/text_field/form.radio_button';
import { FileInputBase } from '@components/input_file/input.file';
import { TagInput } from '@components/text_field/tagInput/tagInput';
import { Step } from '@components/multistepForm/multistep-form';
import { criticalLevelTags, highLevelTags, mediumLevelTags, lowLevelTags, informativeLevelTags } from './data';
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
      this.renderFieldFullWidth(q, this.fields.visibility, state.visibility);
      this.renderFieldFullWidth(q, this.fields.attachments, state.attachments);
    });
  }

  private renderFieldFullWidth(q: Quark, field: FormTextField | TagInput, value: any, className?: string): void {
    console.log('Rendering field:', field); // Check if field is defined
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
  private renderCustomField(q: Quark, field: FormTextField, value: any, widthFraction: number): void {
    $(q, 'div', 'form-field', {}, (q) => {
      field.render(q);
      field.setValue(value);
      field.addClass(`w-${widthFraction}`);
    });
  }

  private fields: { [key: string]: any } = {
    criticalFunding: new FormTextField({ label: 'Bounty for Critical', placeholder: 'Bounty for Critical', name: 'criticalFunding' }),
    highFunding: new FormTextField({ label: 'Bounty for High', placeholder: 'Bounty for High', name: 'highFunding' }),
    mediumFunding: new FormTextField({ label: 'Bounty for Medium', placeholder: 'Bounty for Medium', name: 'mediumFunding' }),
    lowFunding: new FormTextField({ label: 'Bounty for Low', placeholder: 'Bounty for Low', name: 'lowFunding' }),
    informativeFunding: new FormTextField({ label: 'Bounty for Informative', placeholder: 'Bounty for Informative', name: 'informativeFunding' }),
    critical: new TagInput({ label: 'Critical', placeholder: 'Areas considered of critical risk', name: 'critical', suggestions: criticalLevelTags }),
    high: new TagInput({ label: 'High', placeholder: 'Areas considered of high risk', name: 'high', suggestions: highLevelTags }),
    medium: new TagInput({ label: 'Medium', placeholder: 'Areas considered of medium risk', name: 'medium', suggestions: mediumLevelTags }),
    low: new TagInput({ label: 'Low', placeholder: 'Areas considered of low risk', name: 'low', suggestions: lowLevelTags }),
    informative: new TagInput({ label: 'Informative', placeholder: 'Areas considered of informative risk', name: 'informative', suggestions: informativeLevelTags }),
    visibility: new FormRadioButton({ label: 'Visibility', options: ['Public', 'Private'], name: 'visibility' }),
    attachments: new FileInputBase({ label: 'Attachments', name: 'attachments' }),
  };

  constructor() {
    for (const field of Object.values(this.fields)) {
      field.setOnChange((value: string) => {
        const keys = field.name.split('.');
        console.log(keys);
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
