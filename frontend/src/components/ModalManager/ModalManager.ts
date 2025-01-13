type ModalData = {
  name: string;
  element: HTMLElement;
  buttonConfig: ModalConfig;
};

type ModalConfig = {
  [key: string]: () => void;
};

export default class ModalManager {
  private static modalList: ModalData[] = [];

  static includeModal(name: string, buttonConfig: ModalConfig = {}): void {
    const exists = this.modalList.some((modal) => modal.name === name);

    if (exists) {
      const existingModal = this.modalList.find((modal) => modal.name === name)!;
      existingModal.buttonConfig = buttonConfig;
      console.warn(`Modal "${name}" already exists. Configuration updated.`);
      return;
    }

    const modalElement = document.createElement('div');
    modalElement.classList.add('custom-modal');
    modalElement.innerHTML = `
      <div class="modal-content" role="dialog" aria-modal="true" tabindex="-1"></div>
    `;
    document.body.appendChild(modalElement);

    const modalData: ModalData = {
      name,
      element: modalElement,
      buttonConfig,
    };

    this.modalList.push(modalData);
  }

  private static bindButtonActions(modalElement: HTMLElement, buttonConfig: ModalConfig): void {
    for (const [selector, action] of Object.entries(buttonConfig)) {
      const button = modalElement.querySelector(selector);
      if (button) {
        button.addEventListener('click', action);
      } else {
        console.error(`Button with selector "${selector}" not found in modal.`);
      }
    }
  }

  static show(name: string, content: HTMLElement | string): void {
    const modal = this.modalList.find((modal) => modal.name === name);
    if (modal) {
      const contentElement = modal.element.querySelector('.modal-content');
      if (contentElement) {
        contentElement.innerHTML = '';
        if (typeof content === 'string') {
          contentElement.innerHTML = content;
        } else {
          contentElement.appendChild(content);
        }

        (contentElement as HTMLElement).focus();
      }
      document.documentElement.appendChild(modal.element);
      modal.element.style.display = 'flex';

      this.bindButtonActions(modal.element, modal.buttonConfig);

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.hide(name);
        }
      });
    }
  }

  static hide(name: string): void {
    const modal = this.modalList.find((modal) => modal.name === name);
    if (modal) {
      modal.element.style.display = 'none';
    }
  }

  static remove(name: string): void {
    const modalIndex = this.modalList.findIndex((modal) => modal.name === name);
    if (modalIndex !== -1) {
      const modal = this.modalList[modalIndex];
      modal.element.querySelectorAll('*').forEach((el) => {
        const clone = el.cloneNode(true);
        el.parentNode?.replaceChild(clone, el);
      });
      modal.element.remove();
      this.modalList.splice(modalIndex, 1);
    }
  }

  static bindToClass(name: string, className: string): void {
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach((element) => {
      element.addEventListener('click', () => {
        this.show(name, '');
      });
    });
  }
}

// CSS remains the same
const style = document.createElement('style');
style.innerHTML = `
.custom-modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

.modal-content {
  background-color: #fefefe;
  border-radius: 8px; /* Rounded corners for better appearance */
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px; /* Ensure it doesn't grow too large */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
}

`;
document.head.appendChild(style);
