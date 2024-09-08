import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { IconButton } from '../button/icon.button';
import './footer.scss';

export class Footer {
  constructor() {}

  render(q: Quark) {
    $(q, 'div', 'footer', {}, (q) => {
      $(q, 'div', 'footer-top', {}, (q) => {
        $(q, 'div', 'content-left', {}, (q) => {
          $(q, 'img', 'footer-logo', { src: './../../assets/xployt-logo.png' }, '');
          $(q, 'div', 'icons', {}, (q) => {
            new IconButton({
              icon: 'fa-brands fa-facebook',
              label: 'Twitter',
              onClick: () => {
                window.open('https://twitter.com/', '_blank');
              },
            }).render(q);
            // $(q, 'a', 'icon', { href: 'https://www.facebook.com/' }, (q) => {
            //   $(q, 'i', 'fab fa-facebook-f', {}, '');
            //   $(q, 'span', 'icon-text', {}, 'Facebook');
            // });
          });
        });

        $(q, 'div', 'content-mdle', {}, (q) => {
          $(q, 'span', 'footer-content-right-title', {}, '© Xployt 2024. All rights reserved.');
        });

        $(q, 'div', 'content-right', {}, (q) => {
          $(q, 'span', 'footer-content-right-title', {}, '© Xployt 2024. All rights reserved.');
        });
      });
    });

    $(q, 'hr', 'footer-hr', {});

    $(q, 'div', 'footer-bottom', {}, (q) => {
      $(q, 'span', 'footer-content-right', {}, '© Xployt 2024. All rights reserved.');
    });
  }
}
