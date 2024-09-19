import { TextField, TextFieldOptions } from './base';
import { Quark } from '@ui_lib/quark';

interface FormTextFieldOptions extends TextFieldOptions {
  class?: string;
}

export class FormTextField extends TextField {
  private class?: string;
  constructor(options: FormTextFieldOptions) {
    super(options);
  }

  render(parent: Quark): void {
    super.render(parent);
    if (this.class) {
      this.element?.classList.add(this.class);
    }
  }

  addClass(className: string): void {
    this.element?.classList.add(className);
  }
}
