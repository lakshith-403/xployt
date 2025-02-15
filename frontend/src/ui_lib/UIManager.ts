import { Quark, QuarkFunction as $ } from '@ui_lib/quark';

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
}
