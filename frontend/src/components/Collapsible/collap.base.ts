import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './collap.base.scss';

// export interface CollapsibleOptions {
//   title: string;
//   className?: string;
//   initiallyExpanded?: boolean;
//   icon?: string;
//   animated?: boolean;
// }

export class CollapsibleBase {
  protected container?: HTMLElement;
  public content?: HTMLElement;
  private button?: HTMLElement;
  private headerElement?: HTMLElement;
  private title: string;
  private className: string;
  private expanded = false;
  private animated = true;

  constructor(title: string, className: string = '', expanded?: boolean, stopAnimation?: boolean) {
    this.className = className;
    this.title = title;
    if (expanded) this.expanded = true;
    if (stopAnimation) this.animated = false;
  }

  render(q: Quark) {
    this.container = $(q, 'div', `collapsible ${this.className}`, {}, (q) => {
      this.headerElement = $(
          q,
          'div',
          'header',
          {
            onclick: (e:Event) => {
              e.stopPropagation();
              this.toggle();
            },
          },
          (q) => {

            $(q, 'span', 'title', {}, this.title);

            this.button = $(q, 'button', 'toggle-button', {
              'aria-label': this.expanded ? 'Collapse section' : 'Expand section',
              'aria-expanded': this.expanded ? 'true' : 'false'
            }, '');
          }
      );
    });

    // Create content container with appropriate classes
    const contentClasses = this.animated ? 'content content-animated' : 'content';
    this.content = $(this.container!, 'div', contentClasses, {}, '');

    // Set initial state
    if (this.expanded) {
      this.showContent(false);
    } else {
      this.hideContent(false);
    }

    return this.container;
  }

  public toggle() {
    if (!this.isExpanded()) {
      this.showContent(true);
    } else {
      this.hideContent(true);
    }

    // Dispatch custom event
    const event = new CustomEvent('toggle', {
      detail: { expanded: this.expanded },
      bubbles: true
    });
    this.container!.dispatchEvent(event);

    return this.expanded;
  }

  public showContent(animate: boolean = true) {
    this.expanded = true;

    if (this.animated && animate) {
      // Get the scroll height to use for animation
      const contentHeight = this.content!.scrollHeight;
      this.content!.style.height = '0px';
      this.content!.style.opacity = '0';
      this.content!.style.display = 'flex';

      // Trigger reflow
      void this.content!.offsetWidth;

      // Set target height and opacity
      this.content!.style.height = `${contentHeight}px`;
      this.content!.style.opacity = '1';

      // After animation completes, set height to auto
      setTimeout(() => {
        if (this.expanded) {
          this.content!.style.height = 'auto';
        }
      }, 300); // Match transition duration in CSS
    } else {
      this.content!.style.display = 'flex';
      if (this.animated) {
        this.content!.style.height = 'auto';
        this.content!.style.opacity = '1';
      }
    }

    // Update button state
    this.button!.classList.add('expanded');
    this.button!.setAttribute('aria-expanded', 'true');
    this.button!.setAttribute('aria-label', 'Collapse section');

    // Update header state
    this.headerElement!.classList.add('expanded');
  }

  public hideContent(animate: boolean = true) {
    if (this.animated && animate) {
      // Set explicit height before animating to 0
      const contentHeight = this.content!.scrollHeight;
      this.content!.style.height = `${contentHeight}px`;

      // Trigger reflow
      void this.content!.offsetWidth;

      // Animate to 0
      this.content!.style.height = '0px';
      this.content!.style.opacity = '0';

      // Hide after animation
      setTimeout(() => {
        if (!this.expanded) {
          this.content!.style.display = 'none';
        }
      }, 300); // Match transition duration in CSS
    } else {
      this.content!.style.display = 'none';
      if (this.animated) {
        this.content!.style.height = '0px';
        this.content!.style.opacity = '0';
      }
    }

    this.expanded = false;

    // Update button state
    this.button!.classList.remove('expanded');
    this.button!.setAttribute('aria-expanded', 'false');
    this.button!.setAttribute('aria-label', 'Expand section');

    // Update header state
    this.headerElement!.classList.remove('expanded');
  }

  public isExpanded(): boolean {
    return this.expanded;
  }

  public getContent(): HTMLElement {
    return this.content!;
  }

  public setTitle(title: string): void {
    this.title = title;
    const titleElement = this.headerElement!.querySelector('.title');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }
}