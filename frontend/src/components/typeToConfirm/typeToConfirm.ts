import { Quark, QuarkFunction as $ } from '@ui_lib/quark';

    export class TypeToConfirm {
      private requiredContent: string;
      private onConfirm: () => void;
      private inputField!: HTMLInputElement;
      private confirmButton!: HTMLButtonElement;

      constructor(requiredContent: string, onConfirm: () => void) {
        this.requiredContent = requiredContent;
        this.onConfirm = onConfirm;
      }

      private handleInputChange(): void {
        const inputValue = this.inputField.value;
        this.confirmButton.disabled = inputValue !== this.requiredContent;
      }

      render(parent: Quark): void {
        $(parent, 'div', 'type-to-confirm', {}, (q) => {
          // Display the required content to type
          $(q, 'p', 'required-content', {}, `Please type: "${this.requiredContent}"`);

          // Input field
          this.inputField = $(q, 'input', 'input-field', {
            type: 'text',
            placeholder: 'Type here...',
          }) as HTMLInputElement;

          this.inputField.addEventListener('input', () => this.handleInputChange());

          // Confirm button
          this.confirmButton = $(q, 'button', 'confirm-button', {}, 'Confirm') as HTMLButtonElement;
          this.confirmButton.disabled = true;

          this.confirmButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.onConfirm();
          });
        });
      }
    }