import { QuarkFunction as $, Quark } from './../../ui_lib/quark';
import './input.file.scss';

export interface FileInputProps {
  label?: string;
  className?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange?: (event: Event) => void;
  onFocus?: (event: Event) => void;
}

export class FileInputBase {
  protected element?: HTMLInputElement;
  private props: FileInputProps;

  constructor(props: FileInputProps) {
    this.props = props;
  }

  private applyProps(props: FileInputProps): void {
    if (props.className) this.element!.classList.add(props.className);
    if (props.accept) this.element!.accept = props.accept;
    if (props.multiple) this.element!.multiple = props.multiple;
    if (props.disabled) this.element!.disabled = props.disabled;
    if (props.onChange) this.element!.addEventListener('change', props.onChange);
    if (props.onFocus) this.element!.addEventListener('focus', props.onFocus);
  }

  public render(parent: Quark): void {
    const container = $(parent, 'div', 'file-input-container', {});
    if (this.props.label) {
      $(container, 'span', 'file-input-label', {}, this.props.label);
    }
    this.element = $(container, 'input', 'file-input', { type: 'file' }) as HTMLInputElement;
    this.applyProps(this.props);
  }

  public getElement(): HTMLInputElement {
    return this.element!;
  }

  public clearValue(): void {
    this.element!.value = '';
  }

  public setDisabled(disabled: boolean): void {
    this.element!.disabled = disabled;
  }

  public setAccept(accept: string): void {
    this.element!.accept = accept;
  }

  public setMultiple(multiple: boolean): void {
    this.element!.multiple = multiple;
  }
}
