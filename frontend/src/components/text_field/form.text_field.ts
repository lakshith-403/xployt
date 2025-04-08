import { TextField, TextFieldOptions } from './base';
import { Quark } from './../../ui_lib/quark';

export interface FormTextFieldOptions extends TextFieldOptions {
  class?: string;
  onKeyDown?: (event: KeyboardEvent) => void;
  parentClass?: string;
  type?: string;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
}

export class FormTextField extends TextField {
  private class?: string;
  private onKeyDown?: (event: KeyboardEvent) => void;
  private parentClass?: string;
  private onFocus?: (event: FocusEvent) => void;
  private onBlur?: (event: FocusEvent) => void;

  constructor(options: FormTextFieldOptions) {
    super(options);
    this.class = options.class;
    this.onKeyDown = options.onKeyDown;
    this.parentClass = options.parentClass || 'label-left';
    this.onFocus = options.onFocus;
    this.onBlur = options.onBlur;
  }

  render(parent: Quark): void {
    super.render(parent);
    if (this.class) {
      this.element?.classList.add(this.class);
    }
    if (this.parentClass) {
      this.container?.classList.add(this.parentClass);
    }
    if (this.onKeyDown) {
      this.element?.addEventListener('keydown', this.onKeyDown);
    }
    if (this.onFocus) {
      this.element?.addEventListener('focus', this.onFocus);
    }
    if (this.onBlur) {
      this.element?.addEventListener('blur', this.onBlur);
    }
  }

  addClass(className: string): void {
    this.element?.classList.add(className);
  }
}
