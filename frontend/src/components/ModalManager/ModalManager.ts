import './ModalManager.scss';

type ModalData = {
  name: string;
  element: HTMLElement;
  buttonConfig: ModalConfig;
};

type ModalConfig = {
  [key: string]: () => void;
};

export default class modalManager {
  private static modalList: ModalData[] = [];

  static includeModal(name: string, buttonConfig: ModalConfig = {}): void {
    const exists = this.modalList.some((modal) => modal.name === name);

    if (!exists) {
      const modalElement = document.createElement('div');
      modalElement.classList.add('custom-modal');
      modalElement.classList.add(name);
      modalElement.innerHTML = `
        <div class="modal-content">
          <span class="close-button">&times;</span>
        </div>
      `;
      // console.log('Appending modal element to body', name, modalElement);
      document.body.appendChild(modalElement);

      const modalData: ModalData = {
        name: name,
        element: modalElement,
        buttonConfig: buttonConfig,
      };

      this.modalList.push(modalData);

      // Add event listener for close button
      modalElement.querySelector('.close-button')?.addEventListener('click', () => {
        this.hide(name);
      });
    } else {
      console.error(`Requested Modal ${name} is already created`);
    }
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

  static show(name: string, content: HTMLElement | string, enableAsynchronous: boolean = false): Promise<void> {
    const modal = this.modalList.find((modal) => modal.name === name);
    if (!modal) {
      return Promise.reject(new Error(`Modal with name "${name}" not found`));
    }

    const contentElement = modal.element.querySelector('.modal-content');
    if (contentElement) {
      contentElement.innerHTML = `
      <span class="close-button">&times;</span>
      ${typeof content === 'string' ? content : content.outerHTML}
    `;
      contentElement.querySelector('.close-button')?.addEventListener('click', () => {
        this.hide(name);
      });
    }

    modal.element.style.display = 'flex';
    // Bind button actions
    this.bindButtonActions(modal.element, modal.buttonConfig);

    if (enableAsynchronous) {
      return new Promise<void>((resolve) => {
        // console.log('ModalManager.show in async mode', modal.name);
        const buttons = modal.element.querySelectorAll('button');
        buttons.forEach((button) => {
          button.addEventListener(
            'click',
            () => {
              this.hide(name);
              resolve();
            },
            { once: true }
          );
        });
      });
    }
    // console.log('ModalManager.show in non-async mode', modal.name);
    // Resolve immediately for non-asynchronous behavior
    return Promise.resolve();
  }

  static hide(name: string): void {
    // console.log('ModalManager.hide', name);
    const modal = this.modalList.find((modal) => modal.name === name);
    if (modal) {
      modal.element.style.display = 'none';
    }
  }

  static remove(name: string): void {
    const modalIndex = this.modalList.findIndex((modal) => modal.name === name);
    if (modalIndex !== -1) {
      const modal = this.modalList[modalIndex];
      modal.element.remove();
      this.modalList.splice(modalIndex, 1);
    }
  }

  static bindToClass(name: string, className: string): void {
    // console.log('ModalManager.bindToClass', name, className);
    const elements = document.querySelectorAll(`.${className}`);
    elements.forEach((element) => {
      element.addEventListener('click', () => {
        this.show(name, '');
      });
    });
  }
}

function getAllClasses(element: Element): string[] {
  let classes: string[] = Array.from(element.classList);
  element.querySelectorAll('*').forEach((child) => {
    classes = classes.concat(Array.from(child.classList));
  });
  return classes;
}
// Utility functions
export function convertToDom(htmlString: string): HTMLElement {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  // console.log('convertToDom classes:', getAllClasses(doc.body));
  return doc.body as HTMLElement;
}

export function setContent(modalElement: HTMLElement, content: { [selector: string]: string }): void {
  // console.log('setContent', content);
  const contentElement = modalElement.querySelector('.modal-body');
  // console.log('contentElement', contentElement);
  if (contentElement) {
    // Iterate over the content object
    for (const [selector, text] of Object.entries(content)) {
      const element = contentElement.querySelector(selector);
      if (element) {
        element.textContent = text;
      } else {
        console.warn(`Element with selector "${selector}" not found in modal.`);
      }
    }
    // // Add event listener for close button
    // contentElement.querySelector('.close-button')?.addEventListener('click', () => {
    //   modalElement.style.display = 'none';
    // });
  }
}
