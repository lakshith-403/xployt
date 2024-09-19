import { QuarkFunction as $, Quark } from '../../ui_lib/quark';

export class FileInput {
  element: HTMLInputElement;
  labelElement: HTMLLabelElement;

  constructor(parent: HTMLElement, labelText: string) {
    const container = $(parent, 'div', 'file-input-container', {}) as HTMLDivElement;

    this.labelElement = $(container, 'label', 'file-input-label', {}) as HTMLLabelElement;
    this.labelElement.textContent = labelText;

    this.element = $(container, 'input', 'file-input', { type: 'file' }) as HTMLInputElement;
    container.appendChild(this.element);
  }

  getFiles(): FileList | null {
    return this.element.files;
  }
}

export default FileInput;
