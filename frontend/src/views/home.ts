import { IconButton } from '../components/button/icon.button';
import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { View, ViewHandler } from '../ui_lib/view';
import { Button, ButtonType } from '@components/button/base';
import { router } from '@ui_lib/router';
// import './../assets/landing.webp';
// import './../assets/dash.png';

class HomeView extends View {
  private hackerButton: Button;
  private clientButton: Button;

  constructor() {
    super();
    this.clientButton = new Button({
      label: 'Submit a Project',
      onClick: () => {
        router.navigateTo('/dashboard');
      },
    });
    this.hackerButton = new Button({
      label: 'Start Hacking',
      type: ButtonType.SECONDARY,
      onClick: () => {
        router.navigateTo('/dashboard');
      },
    });
  }

  render(q: Quark): void {
    console.log('HomeView render');
    $(q, 'div', '', { id: 'home' }, (q) => {
      $(q, 'div', 'home-section', {}, (q) => {
        $(q, 'h1', '', {}, 'Security Through Collaboration');
        $(q, 'p', '', {}, 'Collaborate. Protect. Strengthen your systems.');
        $(q, 'span', 'home-buttons', {}, (q) => {
          this.hackerButton.render(q);
          this.clientButton.render(q);
        });
      });
      $(q, 'div', 'home-section', {}, (q) => {
        // $(q, 'p', '', {}, 'This is the home page')
        $(q, 'img', 'icon-image', { src: './../assets/landing.png' });
      });
    });
  }
}

export const homeViewHandler = new ViewHandler('', HomeView);
