import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { View, ViewHandler } from '@ui_lib/view';
import { Button, ButtonType } from '@components/button/base';
import { router } from '@ui_lib/router';

class SignupView extends View {
  private hackerButton: Button;
  private clientButton: Button;

  constructor() {
    super();
    this.hackerButton = new Button({
      label: 'Sign Up as Hacker',
      type: ButtonType.SECONDARY,
      onClick: () => {
        router.navigateTo('/hacker/register');
      },
    });
    this.clientButton = new Button({
      label: 'Sign Up as Client',
      onClick: () => {
        router.navigateTo('/client/register');
      },
    });
  }

  render(q: Quark): void {
    console.log('SignupView render');
    $(q, 'div', '', { id: 'signup' }, (q) => {
      $(q, 'div', 'signup-section', {}, (q) => {
        $(q, 'h1', '', {}, 'Choose Your Path');
        $(q, 'p', '', {}, 'Join our community as either a security expert or a client.');
        
        // Create two columns
        $(q, 'div', 'signup-columns d-flex flex-row justify-content-around h-100 align-items-center', {}, (q) => {
          // Left column for Hacker
          $(q, 'div', 'signup-column', {}, (q) => {
            $(q, 'h2', '', {}, 'Security Expert');
            $(q, 'p', '', {}, 'Join as a hacker to help secure systems and earn rewards.');
            this.hackerButton.render(q);
          });
          
          // Right column for Client
          $(q, 'div', 'signup-column', {}, (q) => {
            $(q, 'h2', '', {}, 'Client');
            $(q, 'p', '', {}, 'Submit your projects and get them secured by experts.');
            this.clientButton.render(q);
          });
        });
      });
    });
  }
}

export const signupViewHandler = new ViewHandler('', SignupView); 