import NETWORK from '@data/network/network';
import { Quark, QuarkFunction as $ } from '@ui_lib/quark';

export default class GenericCard {
  private options: { highLightKeys?: string[]; highlightClassName?: string; showKeys?: string[]; callback?: () => void };

  constructor(
    private readonly url: string,
    private readonly title: string,
    private readonly className: string,
    options: { highLightKeys?: string[]; highlightClassName?: string; showKeys?: string[]; callback?: () => void } = {
      highLightKeys: [],
      highlightClassName: '',
      showKeys: [],
      callback: () => {},
    }
  ) {
    this.className = className;
    this.options = options;
  }

  private userInfo: any;

  async loadData(): Promise<void> {
    const response = await NETWORK.get(this.url);
    this.userInfo = response.data.userData[0];
    console.log('User Info', this.userInfo);
  }

  async render(q: Quark): Promise<void> {
    await this.loadData();
    const card = $(q, 'div', this.className + ' p-2 rounded-2 d-flex flex-column gap-1', {}, (q) => {
      $(q, 'span', 'text-default font-bold', {}, this.title);

      if (this.userInfo && typeof this.userInfo === 'object') {
        Object.keys(this.userInfo).forEach((key) => {
          if (this.options.showKeys && this.options.showKeys.length > 0 && !this.options.showKeys.includes(key)) return;
          $(
            q,
            'span',
            'ml-1 d-block ' + (this.options.highLightKeys && this.options.highLightKeys.length > 0 && this.options.highLightKeys.includes(key) ? this.options.highlightClassName : ''),
            {},
            typeof this.userInfo[key] === 'string' ? this.userInfo[key] : JSON.stringify(this.userInfo[key])
          );
        });
      } else {
        $(q, 'span', '', {}, 'No data');
      }
    });

    if (this.options.callback) {
      card.addEventListener('click', this.options.callback);
      card.style.cursor = 'pointer';
    }
  }
}
