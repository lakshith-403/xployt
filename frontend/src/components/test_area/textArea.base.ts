import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import './textArea.base.scss';

export interface TextAreaProps {
  value?: string;
  label?: string;
  className?: string;
  placeholder?: string;
  rows?: number;
  cols?: number;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  onFocus?: (value: string) => void;
}

export class TextAreaBase {
  protected element?: HTMLTextAreaElement;
  private props: TextAreaProps;

  constructor(props: TextAreaProps) {
    this.props = props;
  }

  private applyProps(props: TextAreaProps): void {
    if (props.className) this.element!.classList.add(props.className);
    if (props.value) this.element!.value = props.value;
    if (props.placeholder) this.element!.placeholder = props.placeholder;
    if (props.rows) this.element!.rows = props.rows;
    if (props.cols) this.element!.cols = props.cols;
    if (props.maxLength) this.element!.maxLength = props.maxLength;
    if (props.disabled) this.element!.disabled = props.disabled;
    if (props.readOnly) this.element!.readOnly = props.readOnly;
    if (props.onChange) {
      this.element!.addEventListener('input', (e) => {
        props.onChange!((e.target as HTMLInputElement).value);
      });
    }
    if (props.onFocus) {
      this.element!.addEventListener('focus', () => {
        props.onFocus!(this.element!.value);
      });
    }
  }

  public render(parent: Quark): void {
    const container = $(parent, 'div', 'text-area-container', {});
    if (this.props.label) {
      $(container, 'span', 'text-area-label', {}, this.props.label);
    }
    this.element = $(container, 'textarea', 'text-area-input', {}) as HTMLTextAreaElement;
    this.applyProps(this.props);
  }

  public getElement(): HTMLTextAreaElement {
    return this.element!;
  }

  public setValue(value: string): void {
    this.element!.value = value;
  }

  public getValue(): string {
    return this.element!.value;
  }

  public setDisabled(disabled: boolean): void {
    this.element!.disabled = disabled;
  }

  public setReadOnly(readOnly: boolean): void {
    this.element!.readOnly = readOnly;
  }

  public setPlaceholder(placeholder: string): void {
    this.element!.placeholder = placeholder;
  }
}
