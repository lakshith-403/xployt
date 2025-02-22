import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';

export class UIManager {
  private static instance: UIManager;

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
   */
  public static listObjectGivenKeys(q: Quark, object: any, showKeys: string[] = [], options: { className: string } = { className: '' }): void {
    $(q, 'ul', options.className, {}, (q) => {
      Object.keys(object).forEach((key) => {
        if (!showKeys.includes(key)) return;
        $(q, 'li', '', {}, (q) => {
          $(q, 'span', '', {}, key);
          $(q, 'span', '', {}, ' : ');
          $(q, 'span', '', {}, typeof object[key] === 'string' ? object[key] : JSON.stringify(object[key]));
        });
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
    LoadingScreen.show();
  }

  static hideLoadingScreen(): void {
    LoadingScreen.hide();
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

  // public static advancedListObject(q: Quark, object: any, showKeys: string[] = [], options: { className?: string } = {}): void {
  //   $(q, 'ul', options.className || '', {}, (q) => {
  //     Object.keys(object).forEach((key) => {
  //       if (showKeys.length > 0 && !showKeys.includes(key)) return;
  //       $(q, 'li', '', {}, (q) => {
  //         // Render the key
  //         $(q, 'span', '', { style: 'font-weight: bold;' }, key);
  //         $(q, 'span', '', {}, ' : ');

  //         const value = object[key];

  //         // If value is an object (or array), render recursively with a toggle button
  //         if (typeof value === 'object' && value !== null) {
  //           // Create a toggle button to collapse/expand nested content
  //           $(
  //             q,
  //             'button',
  //             'toggle-button',
  //             {
  //               onclick: (event: Event) => {
  //                 const target = (event.currentTarget as HTMLElement).nextElementSibling;
  //                 if (target) {
  //                   (target as HTMLElement).style.display = (target as HTMLElement).style.display === 'none' ? 'block' : 'none';
  //                 }
  //               },
  //             },
  //             'Toggle'
  //           );

  //           // Container for nested object/array
  //           $(q, 'div', 'nested-list', { style: 'display: block; margin-left: 20px;' }, (nestedQ) => {
  //             if (Array.isArray(value)) {
  //               // Render array values with indices
  //               $(nestedQ, 'ul', 'array-list', {}, (arrayQ) => {
  //                 value.forEach((item, index) => {
  //                   $(arrayQ, 'li', 'array-item', {}, (itemQ) => {
  //                     $(itemQ, 'span', 'array-index', { style: 'font-style: italic;' }, `${index}: `);
  //                     if (typeof item === 'object' && item !== null) {
  //                       UIManager.advancedListObject(itemQ, item, showKeys, options);
  //                     } else {
  //                       $(itemQ, 'span', 'array-value', {}, item.toString());
  //                     }
  //                   });
  //                 });
  //               });
  //             } else {
  //               // Recursively render nested object
  //               UIManager.advancedListObject(nestedQ, value, showKeys, options);
  //             }
  //           });
  //         } else {
  //           // Render primitive values directly
  //           $(q, 'span', 'advanced-value', {}, value.toString());
  //         }
  //       });
  //     });
  //   });
  // }
}
