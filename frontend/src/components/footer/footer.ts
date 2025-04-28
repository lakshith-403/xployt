import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import { IconButton } from '../button/icon.button';
import './footer.scss';
import {router} from "@ui_lib/router";
import {User} from "@data/user";
import {CACHE_STORE} from "@data/cache";

export class Footer {
  user!: User;
  constructor() {}

  async render(q: Quark) {
    this.user = await CACHE_STORE.getUser().get();
    q.innerHTML = '';
    $(q, 'div', 'footer', {}, (q) => {
      $(q, 'div', 'footer-top', {}, (q) => {
        $(q, 'div', 'content-left', {}, (q) => {
          $(q, 'img', 'footer-logo', {src: './../assets/xployt-logo.png', alt: 'logo'}, '')
              .addEventListener('click', () => router.navigateTo('/'));
          $(q, 'div', 'icons', {}, (q) => {
            new IconButton({
              icon: 'fa-brands fa-instagram',
              label: '',
              onClick: () => {
                window.open('https://instagram.com/', '_blank');
              },
            }).render(q);
            new IconButton({
              icon: 'fa-brands fa-facebook',
              label: '',
              onClick: () => {
                window.open('https://twitter.com/', '_blank');
              },
            }).render(q);
            new IconButton({
              icon: 'fa-brands fa-linkedin',
              label: '',
              onClick: () => {
                window.open('https://twitter.com/', '_blank');
              },
            }).render(q);
            new IconButton({
              icon: 'fa-brands fa-discord',
              label: '',
              onClick: () => {
                window.open('https://twitter.com/', '_blank');
              },
            }).render(q);
          });
        });

        $(q, 'div', 'content-middle', {}, (q) => {
          $(q, 'span', 'link', {}, 'Validator Applications')
              .addEventListener('click', () => router.navigateTo('/validator/application'));
          (this.user?.type == "Client" || this.user?.type == "Hacker") && $(q, 'span', 'link', {}, 'User Agreement')
              .addEventListener('click', () => router.navigateTo(`/home/user-agreement/${this.user?.type.toLocaleLowerCase}`));
          $(q, 'span', 'link', {}, 'Privacy Policy')
              .addEventListener('click', () => router.navigateTo(`/home/privacy-policy/${this.user?.type.toLocaleLowerCase}`));
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
