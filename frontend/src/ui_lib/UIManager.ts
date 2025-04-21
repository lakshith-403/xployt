import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';

export class UIManager {
  private static instance: UIManager;
  private static loadingScreenCounter: number = 0;

  private constructor() {}

  public static getInstance(): UIManager {
    if (!UIManager.instance) {
      UIManager.instance = new UIManager();
    }
    return UIManager.instance;
  }

  /**
   * Lists the properties of an object in a formatted manner.
   *
   * @param q - The Quark element to append the list items to.
   * @param object - The object to list the properties of.
   * @param ignoreKeys - An array of keys to ignore from the object.
   */
  public static listObject(q: Quark, object: any, ignoreKeys: string[] = [], options: { className: string } = { className: '' }): void {
    $(q, 'ul', options.className, {}, (q) => {
      Object.keys(object).forEach((key) => {
        if (ignoreKeys.includes(key)) return;
        $(q, 'li', '', {}, (q) => {
          $(q, 'span', '', {}, key);
          $(q, 'span', '', {}, ' : ');
          $(q, 'span', '', {}, typeof object[key] === 'string' ? object[key] : JSON.stringify(object[key]));
        });
      });
    });
  }
  /**
   * Lists the properties of an object in a formatted manner.
   *
   * @param q - The Quark element to append the list items to.
   * @param object - The object to list the properties of.
   * @param showKeys - An array of keys to show from the object.
   * @param options - An object containing the following properties:
   * - className: A string representing the class name to apply to the list items.
   * - preserveCasing: A boolean indicating whether to preserve the original casing of the keys.
   */
  public static listObjectGivenKeys(q: Quark, object: any, showKeys: string[] = [], options: { className: string; preserveCasing?: boolean } = { className: '' }): void {
    $(q, 'ul', options.className, {}, (q) => {
      showKeys.forEach((key) => {
        if (key in object) {
          $(q, 'li', '', {}, (q) => {
            const displayKey = options.preserveCasing ? key : key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
            $(q, 'span', '', {}, displayKey);
            $(q, 'span', '', {}, ' : ');
            $(q, 'span', '', {}, typeof object[key] === 'string' ? object[key] : JSON.stringify(object[key]));
          });
        }
      });
    });
  }

  /**
   * Lists only the values of an object in a formatted manner.
   *
   * @param q - The Quark element to append the list items to.
   * @param object - The object to list the values of.
   * @param highlightKeys - An optional array of keys to highlight.
   * @param highlightClassName - An optional class name to apply to highlighted keys.
   * @param showKeys - An optional array of keys to show.
   */
  public static listObjectValues(
    q: Quark,
    object: any,
    className: string = '',
    highlightKeys: string[] = [],
    highlightClassName: string = '',
    ignoreKeys: string[] = [],
    showKeys: string[] = []
  ): void {
    $(q, 'ul', className, {}, (q) => {
      if (object && typeof object === 'object') {
        Object.keys(object).forEach((key) => {
          if (showKeys.length > 0 && !showKeys.includes(key)) return;
          $(q, 'li', highlightKeys.includes(key) ? highlightClassName : '', {}, (q) => {
            $(q, 'span', '', {}, typeof object[key] === 'string' ? object[key] : JSON.stringify(object[key]));
          });
        });
      } else {
        $(q, 'li', '', {}, (q) => {
          $(q, 'span', '', {}, 'No data');
        });
      }
    });
  }

  static showLoadingScreen(): void {
    this.loadingScreenCounter++;
    if (this.loadingScreenCounter === 1) {
      LoadingScreen.show();
    }
  }

  static hideLoadingScreen(): void {
    this.loadingScreenCounter = Math.max(0, this.loadingScreenCounter - 1);
    if (this.loadingScreenCounter === 0) {
      LoadingScreen.hide();
    }
  }

  static showErrorModal(method: string, url: string, error: any): void {
    setContent(modalAlertForErrors, {
      '.modal-title': 'Error',
      '.modal-message': `Failed to ${method} ${url}: ${error.message ?? 'N/A'} `,
      '.modal-data': error.data ?? 'Data not available',
      '.modal-servletClass': error.servlet ?? 'Servlet not available',
      '.modal-url': error.url ?? 'URL not available',
    });
    ModalManager.show('alertForErrors', modalAlertForErrors);
  }
  static showErrorModalBrief(message: string): void {
    setContent(modalAlertOnlyOK, {
      '.modal-title': 'Error',
      '.modal-message': message,
    });
    ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
  }

  static showSuccessModal(title: string, message: string, callback?: () => void): void {
    setContent(modalAlertOnlyOK, {
      '.modal-title': title,
      '.modal-message': message,
    });
    const modalPromise = ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
    if (callback) {
      modalPromise.then(() => {
        callback();
      });
    }
  }

  /**
   * Converts fields having dates in the format "MMM D, YYYY" to separate fields with original field name + _month, original field name + _day, and original field name + _year.
   *
   * @param object - The object containing the fields to be converted.
   * @param dateFields - An array of field names that contain dates in the format "MMM D, YYYY".
   * @returns A new object with the date fields split into separate fields.
   */
  public static convertDateFields(object: any, dateFields: string[]): any {
    const newObject: any = { ...object };

    dateFields.forEach((field) => {
      if (newObject[field]) {
        const date = new Date(newObject[field]);
        if (!isNaN(date.getTime())) {
          const month = date.toLocaleString('default', { month: 'short' });
          const day = date.getDate();
          const year = date.getFullYear();

          newObject[`${field}_month`] = month;
          newObject[`${field}_day`] = day;
          newObject[`${field}_year`] = year;

          delete newObject[field];
        }
      }
    });

    return newObject;
  }

  // Example data
  // const people = [
  //   { name: "John Doe", age: 30, city: "New York", role: "Developer" },
  //   { name: "Jane Smith", age: 25, city: "London", role: "Designer" },
  //   { name: "Bob Johnson", age: 35, city: "Paris", role: "Manager" }
  // ];

  // // Using the method
  // UIManager.listArrayObjectValues(
  //   quarkedElement,  // Your Quark element
  //   "Team Members",  // Title
  //   people,          // Array of objects
  //   ["name", "role", "city"],  // Keys to display
  //   { className: "team-list" } // Optional CSS class
  // );
  public static listArrayObjectValues(q: Quark, title: string, objects: any[], keys: string[], options: { className?: string } = {}): void {
    $(q, 'div', 'd-flex flex-column', {}, (q) => {
      $(q, 'h2', 'sub-heading-2', {}, title);
      $(q, 'ul', options.className || '', {}, (q) => {
        objects.forEach((obj) => {
          $(q, 'li', 'list-object-values-item', {}, (q) => {
            const valuesToShow = keys.map((key) => {
              const value = obj[key];
              return typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
            });
            $(q, 'span', 'list-object-values-text', {}, valuesToShow.join(' | '));
          });
        });
      });
    });
  }

  /**
   * Displays an array of elements as a list
   *
   * @param q - The Quark element to render the list in
   * @param title - The title of the list
   * @param items - Array of items to display
   * @param options - Optional configuration: className for custom styling
   *
   * Example usage:
   *
   * const technologies = ["React", "TypeScript", "Node.js", "Express"];
   *
   * UIManager.listArrayValues(
   *   quarkedElement,  // Your Quark element
   *   "Technologies",  // Title
   *   technologies,    // Array of items
   *   { className: "tech-list" } // Optional CSS class
   * );
   */
  public static listArrayValues(q: Quark, title: string, items: any[], options: { className?: string } = {}): void {
    $(q, 'div', 'd-flex flex-column', {}, (q) => {
      $(q, 'h2', 'sub-heading-2', {}, title);
      $(q, 'ul', options.className || '', {}, (q) => {
        items.forEach((item) => {
          $(q, 'li', 'list-item', {}, (q) => {
            $(q, 'span', 'list-item-text', {}, String(item));
          });
        });
      });
    });
  }
}
