import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { FormTextField } from '@components/text_field/form.text_field';
import './TestingSecurity.scss';
import { Step } from '@components/multistepForm/multistep-form';

class TestingSecurity implements Step {
  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'div', 'testing-security', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Testing and Security');

      this.renderFieldFullWidth(q, this.fields.testingScope, state.testingScope);
      this.renderFieldFullWidth(q, this.fields.outOfScope, state.outOfScope);
      this.renderFieldFullWidth(q, this.fields.objectives, state.objectives);
      this.renderFieldFullWidth(q, this.fields.securityRequirements, state.securityRequirements);
    });
  }

  private renderFieldFullWidth(q: Quark, field: FormTextField, value: any): void {
    $(q, 'div', 'form-field', {}, (q) => {
      field.render(q);
      field.setValue(value);
      field.addClass('w-full');
    });
  }
  private renderCustomField(q: Quark, field: FormTextField, value: any, widthFraction: number): void {
    $(q, 'div', 'form-field', {}, (q) => {
      field.render(q);
      field.setValue(value);
      field.addClass(`w-${widthFraction}`);
    });
  }

  private fields: { [key: string]: any } = {
    testingScope: new FormTextField({ label: 'Testing Scope', placeholder: 'Scope of testing', name: 'testingScope' }),
    outOfScope: new FormTextField({ label: 'Out of Scope', placeholder: 'Areas not covered by testing', name: 'outOfScope' }),
    objectives: new FormTextField({ label: 'Objectives', placeholder: 'Objectives of testing', name: 'objectives' }),
    securityRequirements: new FormTextField({ label: 'Security Requirements', placeholder: 'Security requirements', name: 'securityRequirements' }),
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

export default TestingSecurity;
