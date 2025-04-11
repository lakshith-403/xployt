import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import { Button, ButtonType } from '@components/button/base';
import { router } from '@ui_lib/router';
import { User } from '@/data/user';
import { CACHE_STORE } from '@/data/cache';
// import './../assets/landing.webp';
// import './../assets/dash.png';

class HomeView extends View {
  private hackerButton: Button;
  private clientButton: Button;
  private dashboardButton: Button;

  constructor() {
    super();
    this.clientButton = new Button({
      label: 'Submit a Project',
      onClick: () => {
        router.navigateTo('/client');
      },
    });
    this.hackerButton = new Button({
      label: 'Start Hacking',
      type: ButtonType.SECONDARY,
      onClick: () => {
        router.navigateTo('/hacker');
      },
    });
    this.dashboardButton = new Button({
      label: 'Dashboard',
      type: ButtonType.SECONDARY,
      onClick: () => {
        router.navigateTo('/dashboard');
      },
    });
  }

  render(q: Quark): void {
    console.log('HomeView render');
    let buttonComp: Quark;
    $(q, 'div', '', { id: 'home' }, (q) => {
      $(q, 'div', 'home-section', {}, (q) => {
        $(q, 'h1', '', {}, 'Security Through Collaboration');
        $(q, 'p', '', {}, 'Collaborate. Protect. Strengthen your systems.');
        buttonComp = $(q, 'span', 'home-buttons', {}, (q) => {
          this.hackerButton.render(q);
          this.clientButton.render(q);
        });
      });
      $(q, 'div', 'home-section', {}, (q) => {
        // $(q, 'p', '', {}, 'This is the home page')
        $(q, 'img', 'icon-image', { src: './../assets/landing.png' });
      });
    });

    CACHE_STORE.getUser()
      .get()
      .then((res) => {
        buttonComp.innerHTML = '';

        if (res == null || res.type.toLowerCase() == 'guest') {
          this.hackerButton.render(buttonComp);
          this.clientButton.render(buttonComp);
        } else {
          this.dashboardButton.render(buttonComp);
        }
      });
  }
}

export const homeViewHandler = new ViewHandler('', HomeView);
