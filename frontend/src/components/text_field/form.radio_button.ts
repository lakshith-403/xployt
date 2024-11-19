import { Quark } from '@/ui_lib/quark';
import { TextField, TextFieldOptions } from './base';

interface FormTextFieldOptions extends TextFieldOptions {
  class?: string;
  onKeyDown?: (event: KeyboardEvent) => void;
  parentClass?: string;
  options: string[];
}
export class FormRadioButton extends TextField {
  private class?: string;
  private onKeyDown?: (event: KeyboardEvent) => void;
  private parentClass?: string;

  constructor(options: FormTextFieldOptions) {
    super({ ...options, type: 'radio' });
    this.class = options.class;
    this.onKeyDown = options.onKeyDown;
    this.parentClass = options.parentClass || 'label-left';
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
  }

  addClass(className: string): void {
    this.element?.classList.add(className);
  }
}
