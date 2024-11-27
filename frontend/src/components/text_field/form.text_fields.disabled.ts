import { Quark } from '@/ui_lib/quark';
import { FormTextField, FormTextFieldOptions } from './form.text_field';

export class FormTextFieldDisabled extends FormTextField {
  constructor(options: FormTextFieldOptions) {
    super(options);
  }

  render(parent: Quark): void {
    super.render(parent);
    this.element?.setAttribute('disabled', 'true');
    this.addClass('disabled');
  }
}
