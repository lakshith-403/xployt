import { View, ViewHandler } from "../ui_lib/view";
import { Quark, QuarkFunction as $ } from "../ui_lib/quark";
import { TextField } from "../components/text_field/base";
import { Button, ButtonType } from "../components/button/base";

export class LoginView extends View {
  private emailField: TextField;
  private passwordField: TextField;
  private loginButton: Button;

  constructor() {
    super();
    this.emailField = new TextField({
      label: '',
      placeholder: 'Enter your email'
    });
    this.passwordField = new TextField({
      label: '',
      placeholder: 'Enter your password',
      type: 'password'
    });
    this.loginButton = new Button({
      label: 'Login',
      onClick: this.handleLogin.bind(this),
      type: ButtonType.PRIMARY
    });
  }

  public render(q: Quark): void {
    $(q, 'div', 'login-view', {}, q => {
        $(q, 'div', 'login-left', {}, q => {
            $(q, 'img', 'login-icon-image', { src: 'assets/xployt-logo.png' });
            $(q, 'p', 'login-description', {}, 
                'Log in to a straight to point description about what happens when you log in');
        });
        $(q, 'div', 'login-container', {}, q => {
            $(q, 'h1', 'login-title', {}, 'Sign in');
            
            this.emailField.render(q);
            this.passwordField.render(q);

            $(q, 'div', 'spaced-row', {}, q => {
                $(q, 'div', 'remember-me', {}, q => {
                    $(q, 'input', '', { type: 'checkbox', id: 'rememberMe' });
                    $(q, 'label', '', { for: 'rememberMe' }, 'Remember me');
                });

            $(q, 'a', 'label', {}, 'Forgot password?');
            });
    
            $(q, 'div', 'login-button-container', {}, q => {
                this.loginButton.render(q);
            });
        });
    })
  }

  private handleLogin(): void {
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();
    console.log('Login attempt:', { email, password });
  }
}

export const loginViewHandler = new ViewHandler('', LoginView)