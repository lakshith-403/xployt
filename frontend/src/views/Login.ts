import { View, ViewHandler } from '../ui_lib/view';
import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { TextField } from '../components/text_field/base';
import { Button, ButtonType } from '../components/button/base';
import { UserCache } from '@/data/user';
import { router } from '@/ui_lib/router';
import { NetworkError } from '@/data/network/network';
import { CACHE_STORE } from '@/data/cache';

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
        $(q, 'img', 'login-icon-image', { src: 'assets/xployt-logo.png' });
        $(q, 'p', 'login-description', {}, 'Log in to a straight to point description about what happens when you log in');
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
      alert('Invalid email format. Please enter a valid email.');
      return;
    }
    const password = this.passwordField.getValue();
    console.log('Login attempt:', { email, password });

    this.userCache
      .signIn(email, password)
      .then((user) => {
        console.log('User logged in:', user);
        alert('User logged in successfully');
        router.navigateTo('/dashboard');
      })
      .catch((error) => {
        if (error instanceof NetworkError && error.statusCode === 401) {
          alert('Invalid credentials provided. Please try again.');
          return;
        }
        console.error('Error logging in user:', error);
        alert('Error logging in user: ' + error);
      });
  }
}

export const loginViewHandler = new ViewHandler('', LoginView);
