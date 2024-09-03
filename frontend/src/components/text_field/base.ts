import { Quark, QuarkFunction as $ } from "../../ui_lib/quark"

export interface TextFieldOptions {
  label: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
}

export class TextField {
  private label: string;
  private placeholder: string;
  private type: string;
  private onChange?: (value: string) => void;
  private element?: Quark;

  constructor(options: TextFieldOptions) {
    this.label = options.label;
    this.placeholder = options.placeholder || '';
    this.type = options.type || 'text';
    this.onChange = options.onChange;
  }

  render(parent: Quark): void {
    const container = $(parent, 'div', 'text-field-container', {});
    
    if (this.label) {
      $(container, 'label', 'text-field-label', {}, this.label);
    }
    
    this.element = $(container, 'input', 'text-field-input', {
      type: this.type,
      placeholder: this.placeholder
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