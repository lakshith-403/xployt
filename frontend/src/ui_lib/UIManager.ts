import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import { modalAlertForErrors } from '@/main';
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
}
