import { Quark, QuarkFunction as $ } from '../../ui_lib/quark';
import './card.base.scss';

export interface CardOptions {
  title: string;
  content?: HTMLElement;
  extraInfo?: string;
}

export class Card {
  protected title: string;
  protected content?: HTMLElement;
  protected extraInfo?: string;
  protected element?: Quark;

  constructor(options: CardOptions) {
    this.title = options.title;
    this.content = options.content;
    this.extraInfo = options.extraInfo || '';
  }

  render(parent: Quark) {
    this.element = $(parent, 'div', 'card', {}, (q) => {
      $(q, 'p', 'card-title', {}, this.title);

      $(q, 'div', 'card-content', {}, (q) => {
        if (this.content) {
          q.appendChild(this.content);
        }
      });

      if (this.extraInfo) {
        $(q, 'p', 'card-extra', {}, this.extraInfo);
      }
    });
  }
}

export interface PriceCardOptions extends CardOptions {
  amount: number;
}

export class PriceCard extends Card {
  protected amount: number;

  constructor(options: PriceCardOptions) {
    super({ title: options.title, extraInfo: options.extraInfo });
    this.amount = options.amount;
  }

  update(newAmount: number): void {
    this.amount = newAmount;
    if (this.element) {
      const priceElement = this.element.querySelector('.card-price');
      if (priceElement) {
        priceElement.textContent = `$${typeof this.amount === 'number' ? this.amount.toFixed(2) : this.amount}`;
      }
    }
  }

  // Override the render method to include price and different content style
  render(parent: Quark) {
    this.element = $(parent, 'div', 'card price-card', {}, (q) => {
      $(q, 'p', 'card-title', {}, this.title);
      $(q, 'p', 'card-price', {}, `$${typeof this.amount === 'number' ? this.amount.toFixed(2) : this.amount}`);
      if (this.extraInfo) {
        $(q, 'p', 'card-extra', {}, this.extraInfo);
      }
    });
  }
}
