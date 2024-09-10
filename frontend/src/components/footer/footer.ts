import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { IconButton } from '../button/icon.button';
import './footer.scss';

export class Footer {
  constructor() {}

  render(q: Quark) {
    $(q, 'div', 'footer', {}, (q) => {
      $(q, 'div', 'footer-top', {}, (q) => {
        $(q, 'div', 'content-left', {}, (q) => {
          $(q, 'img', 'footer-logo', { src: './../assets/xployt-logo.png', alt: 'logo' }, '');
          $(q, 'div', 'icons', {}, (q) => {
            new IconButton({
              icon: 'fa-brands fa-instagram',
              label: 'Twitter',
              onClick: () => {
                window.open('https://instagram.com/', '_blank');
              },
            }).render(q);
            new IconButton({
              icon: 'fa-brands fa-facebook',
              label: 'Twitter',
              onClick: () => {
                window.open('https://twitter.com/', '_blank');
              },
            }).render(q);
            new IconButton({
              icon: 'fa-brands fa-linkedin',
              label: 'Twitter',
              onClick: () => {
                window.open('https://twitter.com/', '_blank');
              },
            }).render(q);
            new IconButton({
              icon: 'fa-brands fa-discord',
              label: 'Twitter',
              onClick: () => {
                window.open('https://twitter.com/', '_blank');
              },
            }).render(q);
          });
        });

        $(q, 'div', 'content-middle', {}, (q) => {
          $(q, 'span', 'link', {}, 'Validator Applications');
          $(q, 'span', 'link', {}, 'Terms and Policy');
          $(q, 'span', 'link', {}, 'Privacy Statement');
          $(q, 'span', 'link', {}, 'Help Center');
          $(q, 'span', 'link', {}, 'Sitemap');
        });

        $(q, 'div', 'content-right', {}, (q) => {
          $(q, 'span', 'title', {}, 'Contact Us');
          $(q, 'div', 'contact-info', {}, (q) => {
            $(q, 'span', 'link', {}, 'info@xployt.com');
          });
          $(q, 'div', 'contact-info', {}, (q) => {
            $(q, 'span', 'link', {}, '1-800-123-4567');
          });
          $(q, 'div', 'contact-info', {}, 'Xployt Co, Colombo, Sri Lanka');
        });
      });
      $(q, 'hr', 'footer-hr', {});

      $(q, 'div', 'footer-bottom', {}, (q) => {
        $(q, 'span', 'footer-content-right', {}, '© Xployt 2024. All rights reserved.');
      });
    });
  }
}
