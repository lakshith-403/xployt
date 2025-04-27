import { Quark, QuarkFunction as $ } from '../../ui_lib/quark';
import './card.base.scss';

export interface CardOptions {
  title: string;
  content?: HTMLElement;
  extraInfo?: string;
  icon?: string; // New optional icon property
}

export class Card {
  protected title: string;
  protected content?: HTMLElement;
  protected extraInfo?: string;
  protected icon?: string;
  protected element?: Quark;

  constructor(options: CardOptions) {
    this.title = options.title;
    this.content = options.content;
    this.extraInfo = options.extraInfo || '';
    this.icon = options.icon;
  }

  render(parent: Quark) {
    this.element = $(parent, 'div', 'card', {}, (q) => {
      const header = $(q, 'div', 'card-header', {});

      if (this.icon) {
        $(header, 'span', 'card-icon', {}, this.icon);
      }

      $(header, 'p', 'card-title', {}, this.title);

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
  currency?: string; // New optional currency property (defaults to $)
  period?: string; // New optional period property (e.g., "/month")
}

export class PriceCard extends Card {
  protected amount: number;
  protected currency: string;
  protected period?: string;

  constructor(options: PriceCardOptions) {
    super({
      title: options.title,
      extraInfo: options.extraInfo,
      icon: options.icon
    });
    this.amount = options.amount;
    this.currency = options.currency || '$';
    this.period = options.period;
  }

  update(newAmount: number): void {
    this.amount = newAmount;
    if (this.element) {
      const priceElement = this.element.querySelector('.price-amount');
      if (priceElement) {
        priceElement.textContent = `${typeof this.amount === 'number' ? this.amount.toFixed(2) : this.amount}`;
        console.log(`Updated price: ${this.amount}`);
      }
    }
  }

  // Override the render method to include price and different content style
  render(parent: Quark) {
    this.element = $(parent, 'div', 'card price-card', {}, (q) => {
      const header = $(q, 'div', 'card-header', {});

      if (this.icon) {
        $(header, 'span', 'card-icon', {}, this.icon);
      }

      $(header, 'p', 'card-title', {}, this.title);

      const priceEl = $(q, 'p', 'card-price', {});

      $(priceEl, 'span', 'price-currency', {}, this.currency);
      $(priceEl, 'span', 'price-amount', {},
          `${typeof this.amount === 'number' ? this.amount.toFixed(2) : this.amount}`
      );

      if (this.period) {
        $(priceEl, 'span', 'price-period', {}, this.period);
      }

      if (this.extraInfo) {
        $(q, 'p', 'card-extra', {}, this.extraInfo);
      }
    });
  }
}
