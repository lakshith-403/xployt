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
  public static listObject(q: Quark, object: any, ignoreKeys: string[] = []): void {
    Object.keys(object).forEach((key) => {
      if (ignoreKeys.includes(key)) return;
      $(q, 'li', '', {}, (q) => {
        $(q, 'span', '', {}, key);
        $(q, 'span', '', {}, ' : ');
        $(q, 'span', '', {}, typeof object[key] === 'string' ? object[key] : JSON.stringify(object[key]));
      });
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
}
