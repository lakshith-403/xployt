import { QuarkFunction as $, Quark } from './../../ui_lib/quark';
import './input.file.scss';
import { Button, ButtonType } from '@components/button/base';

export interface FileInputProps {
  label?: string;
  className?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange?: (files: FileList | null | undefined) => void;
  name?: string;
}

export class FileInputBase {
  private element!: HTMLInputElement;
  private fileInputLabel!: HTMLElement;
  private uploadedFilesContainer!: HTMLElement;
  private props: FileInputProps;
  public name: string;
  private files: File[] = [];

  constructor(props: FileInputProps) {
    this.props = props;
    this.name = props.name || '';
  }

  private handleFileChange(): void {
    const files = this.element.files;
    if (files) {
      this.files = Array.from(files); // Update the files array
      this.renderUploadedFiles();
      // this.fileInputLabel.textContent = this.files.map((file) => file.name).join(', ') || 'No file chosen';
    }
    if (this.props.onChange) {
      this.props.onChange(files);
    }
  }

  public setValue(files: FileList | null | undefined): void {
    console.log('Setting value', files);
    if (files) {
      this.files = Array.from(files); // Update the files array
      this.renderUploadedFiles();
    }
  }

  private renderUploadedFiles(): void {
    this.uploadedFilesContainer.innerHTML = ''; // Clear previous files

    this.files.forEach((file) => {
      this.createAttachmentTag(file.name, URL.createObjectURL(file), this.uploadedFilesContainer);
    });
  }

  private createAttachmentTag(name: string, url: string, container: Quark): void {
    const attachmentTag = $(container, 'span', 'attachment-tag', {}, (q) => {
      $(q, 'span', 'icon', {}, (q) => {
        $(q, 'i', 'fa-solid fa-newspaper', {});
      });
      $(q, 'span', 'name', {}, name);
    });

    const deleteIcon = $(attachmentTag, 'span', 'delete', {}, (q) => {
      $(q, 'i', 'fa-solid fa-trash', {});
    });

    deleteIcon.addEventListener('click', (e) => {
      e.stopPropagation();
      this.files = this.files.filter((f: File) => f.name !== name);
      this.renderUploadedFiles();
    });

    attachmentTag.addEventListener('click', () => {
      window.open(url, '_blank');
    });
  }

  public render(parent: Quark): void {
    const container = $(parent, 'div', 'file-input-container', {});

    $(container, 'label', 'label', {}, 'Attachments');
    this.fileInputLabel = $(container, 'span', 'file-input-label', {});

    this.element = $(container, 'input', 'file-input', {
      type: 'file',
      accept: this.props.accept,
    }) as HTMLInputElement;

    this.element.addEventListener('change', () => this.handleFileChange());

    this.uploadedFilesContainer = $(this.fileInputLabel, 'div', 'uploaded-files', {});

    new Button({
      label: 'Choose File',
      type: ButtonType.PRIMARY,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(this.element);
        this.element.click();
      },
    }).render(container);
  }

  public getFiles(): File[] {
    return this.files;
  }
}
