import { View, ViewHandler } from '../ui_lib/view';
import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { TextField } from '../components/text_field/base';
import { Button, ButtonType } from '../components/button/base';
import { UserCache } from '@/data/user';
import { router } from '@/ui_lib/router';
import { NetworkError } from '@/data/network/network';
import { CACHE_STORE } from '@/data/cache';
import ModalManager, { convertToDom, setContent } from '@/components/ModalManager/ModalManager';
import alertOnlyConfirm from '@alerts/alertOnlyConfirm.html';
import { modalAlertOnlyOK } from '../main';

// Convert the HTML string to a DOM element
const modalElement = convertToDom(alertOnlyConfirm);

// Set text content of modal elements
setContent(modalElement, {
  '.modal-title': 'Login Message',
  '.modal-message': 'Login successful!',
});

// Add event listeners to the modal buttons
ModalManager.includeModal('loginAlert', {
  '.button-confirm': () => {
    ModalManager.hide('loginAlert');
    router.navigateTo('/dashboard');
  },
});

export class LoginView extends View {
  private emailField: TextField;
  private passwordField: TextField;
  private loginButton: Button;
  private userCache: UserCache;

  constructor() {
    super();
    this.emailField = new TextField({
      label: '',
      placeholder: 'Enter your email',
    });
    this.passwordField = new TextField({
      label: '',
      placeholder: 'Enter your password',
      type: 'password',
    });
    this.loginButton = new Button({
      label: 'Login',
      onClick: this.handleLogin.bind(this),
      type: ButtonType.PRIMARY,
    });

    this.userCache = CACHE_STORE.getUser();
  }

  public render(q: Quark): void {
    $(q, 'div', 'login-view', {}, (q) => {
      $(q, 'div', 'login-left', {}, (q) => {
        const loginIcon = $(q, 'img', 'login-icon-image', { src: 'assets/xployt-logo.png' });
        loginIcon.onclick = () => router.navigateTo('/');

        $(q, 'p', 'login-description', {}, '');
      });
      $(q, 'div', 'login-container', {}, (q) => {
        $(q, 'h1', 'login-title', {}, 'Sign in');

        this.emailField.render(q);
        this.passwordField.render(q);

        // $(q, 'div', 'spaced-row', {}, (q) => {
        //   $(q, 'div', 'remember-me', {}, (q) => {
        //     $(q, 'input', '', { type: 'checkbox', id: 'rememberMe' });
        //     $(q, 'label', '', { for: 'rememberMe' }, 'Remember me');
        //   });

        //   $(q, 'a', 'label', {}, 'Forgot password?');
        // });

        $(q, 'div', 'login-button-container', {}, (q) => {
          this.loginButton.render(q);

          new Button({
            label: 'Sign up',
            type: ButtonType.SECONDARY,
            onClick: () => router.navigateTo('/register'),
          }).render(q);
        });
      });
    });
  }

  private handleLogin(): void {
    const email = this.emailField.getValue();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // alert('Invalid email format. Please enter a valid email.');
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Error',
        '.modal-message': 'Invalid email format. Please enter a valid email.',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      return;
    }
    const password = this.passwordField.getValue();
    console.log('Login attempt:', { email, password });

    this.userCache
      .signIn(email, password)
      .then((user) => {
        console.log('User logged in:', user);

        // Method 1: Using a promise
        ModalManager.show('loginAlert', modalElement, true).then(() => {
          console.log('ModalManager.show resolved');
        });
        // Method 2 : Basic modal
        // ModalManager.show('loginAlert', modalElement);
      })
      .catch((error) => {
        if (error instanceof NetworkError && error.statusCode === 401) {
          setContent(modalAlertOnlyOK, {
            '.modal-title': 'Error',
            '.modal-message': 'Invalid credentials provided. Please try again.',
          });
          ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
          // alert('Invalid credentials provided. Please try again.');
          return;
        }
        console.error('Error logging in user:', error);
        // alert('Error logging in user: ' + error);
        setContent(modalAlertOnlyOK, {
          '.modal-title': 'Error',
          '.modal-message': 'Error logging in user: ' + error,
        });
        ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      });
  }
}

export const loginViewHandler = new ViewHandler('', LoginView);
