import { QuarkFunction as $, Quark } from '../../../../ui_lib/quark';
import { FormTextField } from '../../../../components/text_field/form.text_field';
import './ProjectInfo.scss';
import { Step } from './../../../../components/multistepForm/multistep-form';

class ProjectInfo implements Step {
  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    this.updateParentState = updateParentState;

    $(q, 'div', 'project-info', {}, (q) => {
      $(q, 'h3', 'title', {}, 'Project Information');

      this.renderFieldFullWidth(q, this.fields.projectTitle, state.title);
      $(q, 'div', 'dates', {}, (q) => {
        $(q, 'div', 'start-date date', {}, (q) => {
          $(q, 'span', '', {}, 'Start Date *');
          $(q, 'div', 'date-fields', {}, (q) => {
            this.renderCustomField(q, this.fields.startDateDay, state.startDate.day, 1 / 3);
            this.renderCustomField(q, this.fields.startDateMonth, state.startDate.month, 1 / 3);
            this.renderCustomField(q, this.fields.startDateYear, state.startDate.year, 1 / 3);
          });
        });
        $(q, 'div', 'end-date date', {}, (q) => {
          $(q, 'span', '', {}, 'End Date *');
          $(q, 'div', 'date-fields', {}, (q) => {
            this.renderCustomField(q, this.fields.endDateDay, state.endDate.day, 1 / 3);
            this.renderCustomField(q, this.fields.endDateMonth, state.endDate.month, 1 / 3);
            this.renderCustomField(q, this.fields.endDateYear, state.endDate.year, 1 / 3);
          });
        });
      });
      this.renderFieldFullWidth(q, this.fields.description, state.description);
      this.renderFieldFullWidth(q, this.fields.url, state.url);
      this.renderFieldFullWidth(q, this.fields.technicalStack, state.technicalStack);
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

  private fields: { [key: string]: FormTextField } = {
    projectTitle: new FormTextField({ label: 'Project Title *', placeholder: 'Enter your project title', name: 'title' }),
    startDateDay: new FormTextField({ label: '', placeholder: 'DD', name: 'startDate.day' }),
    startDateMonth: new FormTextField({ label: '', placeholder: 'MM', name: 'startDate.month' }),
    startDateYear: new FormTextField({ label: '', placeholder: 'YYYY', name: 'startDate.year' }),
    endDateDay: new FormTextField({ label: '', placeholder: 'DD', name: 'endDate.day' }),
    endDateMonth: new FormTextField({ label: '', placeholder: 'MM', name: 'endDate.month' }),
    endDateYear: new FormTextField({ label: '', placeholder: 'YYYY', name: 'endDate.year' }),
    description: new FormTextField({ label: 'Description *', placeholder: 'Enter your description', name: 'description' }),
    url: new FormTextField({ label: 'URL *', placeholder: 'Enter your URL', name: 'url' }),
    technicalStack: new FormTextField({ label: 'Technical Stack *', placeholder: 'Enter your technical stack', name: 'technicalStack' }),
  };

  constructor() {
    for (const field of Object.values(this.fields)) {
      field.setOnChange((value) => {
        const keys = field.name.split('.');
        console.log(keys);
        if (keys.length > 1) {
          const nestedState = keys.reduceRight<any>((acc, key) => ({ [key]: acc }), value);
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

export default ProjectInfo;
