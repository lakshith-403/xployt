import { Quark, QuarkFunction as $ } from '../../ui_lib/quark';
import './textField.scss';
export interface TextFieldOptions {
  label: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
  name?: string;
}

export class TextField {
  private label: string;
  private placeholder: string;
  private type: string;
  public onChange?: (value: string) => void;
  protected element?: Quark;
  protected container?: Quark;
  public name!: string;

  constructor(options: TextFieldOptions) {
    this.label = options.label;
    this.placeholder = options.placeholder || '';
    this.type = options.type || 'text';
    this.onChange = options.onChange;
    this.name = options.name || '';
  }

  public get value() {
    return (this.element as HTMLInputElement)?.value || '';
  }

  render(parent: Quark): void {
    this.container = $(parent, 'div', 'text-field-container', {});

    if (this.label) {
      $(this.container, 'label', 'text-field-label', {}, this.label);
    }

    this.element = $(this.container, 'input', 'text-field-input', {
      type: this.type,
      placeholder: this.placeholder,
    });

    if (this.onChange) {
      this.element.addEventListener('input', (e) => {
        this.onChange!((e.target as HTMLInputElement).value);
      });
    }
  }

  getValue(): string {
    return (this.element as HTMLInputElement)?.value || '';
  }

  setValue(value: string): void {
    if (this.element) {
      (this.element as HTMLInputElement).value = value;
    }
  }
}
