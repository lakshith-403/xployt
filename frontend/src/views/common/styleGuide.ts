import { Quark, QuarkFunction as $ } from '@/ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import { Button, ButtonType } from '@components/button/base';
import { router } from '@ui_lib/router';

class StyleGuideView extends View {
  constructor() {
    super();
  }

  render(q: Quark): void {
    $(q, 'div', 'style-guide container p-2', {}, (q) => {
      $(q, 'h1', 'style-guide-title', {}, 'Style Guide');

      // Background Colors
      $(q, 'div', 'bg-colors bg-primary p-2 mt-2 mb-1', {}, (q) => {
        $(q, 'h2', '', {}, 'Background Colors');
        $(q, 'div', 'bg-primary p-3 mb-1 border-tertiary-thin', {}, 'bg-primary');
        $(q, 'div', 'bg-secondary p-3 mb-1 border-primary-thin', {}, 'bg-secondary');
        $(q, 'div', 'bg-tertiary p-3 mb-1 border-tertiary-thin', {}, 'bg-tertiary');
        // });
      });

      // Text Colors
      $(q, 'div', 'text-colors bg-secondary p-2 mt-2 mb-1', {}, (q) => {
        $(q, 'h2', '', {}, 'Text Colors');
        $(q, 'p', 'text-primary mb-2', {}, 'This is text-primary text');
        $(q, 'p', 'text-secondary mb-2', {}, 'This is text-secondary text');
        $(q, 'p', 'text-dark-green mb-2', {}, 'This is text-dark-green text');
        $(q, 'p', 'text-light-green mb-2', {}, 'This is text-light-green text');
      });

      // Other Formattings
      $(q, 'div', 'other-formattings p-2', {}, (q) => {
        $(q, 'h2', '', {}, 'Other Formattings');

        // Flexbox
        $(q, 'div', 'flexbox-container p-2', {}, (q) => {
          $(q, 'div', 'd-flex justify-content-center align-items-center bg-primary p-3 mb-1', {}, 'Centered Flexbox');
          $(q, 'div', 'd-flex justify-content-start align-items-center bg-secondary p-3 mb-1', {}, 'Start Flexbox');
          $(q, 'div', 'd-flex justify-content-end align-items-center bg-tertiary p-3 mb-1', {}, 'End Flexbox');
        });

        // Rounded Corners
        $(q, 'div', 'rounded-container p-2', {}, (q) => {
          $(q, 'h3', '', {}, 'Rounded Corners');
          $(q, 'div', 'rounded-1 bg-secondary p-3 mb-1', {}, 'Rounded Corners 1');
          $(q, 'div', 'rounded-2 bg-secondary p-3 mb-1', {}, 'Rounded Corners 2');
          $(q, 'div', 'rounded-3 bg-secondary p-3 mb-1', {}, 'Rounded Corners 3');
        });

        // Widths
        $(q, 'div', 'width-container p-2', {}, (q) => {
          $(q, 'h3', '', {}, 'Widths');
          $(q, 'div', 'w-25 bg-tertiary p-3 mb-1', {}, '25% Width');
          $(q, 'div', 'w-50 bg-tertiary p-3 mb-1', {}, '50% Width');
          $(q, 'div', 'w-75 bg-tertiary p-3 mb-1', {}, '75% Width');
          $(q, 'div', 'w-100 bg-tertiary p-3 mb-1', {}, '100% Width');
        });
      });
    });
  }
}

export const styleGuideViewHandler = new ViewHandler('/styles', StyleGuideView);
