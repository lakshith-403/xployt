import { View, ViewHandler } from "../ui_lib/view";
import { Quark, QuarkFunction as $ } from "../ui_lib/quark";
import { TextField } from "../components/text_field/base";
import { Button, ButtonType } from "../components/button/base";

export class RegisterView extends View {
  private nameField: TextField;
  private emailField: TextField;
  private passwordField: TextField;
  private confirmPasswordField: TextField;
  private companyNameField: TextField;
  private companyDomainField: TextField;
  private companySizeField: TextField;
  private registerButton: Button;

  constructor() {
    super();
    this.nameField = new TextField({
      label: '',
      placeholder: 'Enter your name'
    });
    this.emailField = new TextField({
      label: '',
      placeholder: 'Enter your email'
    });
    this.passwordField = new TextField({
      label: '',
      placeholder: 'Enter your password',
      type: 'password'
    });
    this.confirmPasswordField = new TextField({
      label: '',
      placeholder: 'Confirm your password',
      type: 'password'
    });
    this.registerButton = new Button({
      label: 'Register',
      onClick: this.handleRegister.bind(this),
      type: ButtonType.PRIMARY
    });
    this.companyNameField = new TextField({
      label: '',
      placeholder: 'Enter your company name'
    });
    this.companyDomainField = new TextField({
      label: '',
      placeholder: 'Enter your company domain'
    });
    this.companySizeField = new TextField({
      label: '',
      placeholder: 'Enter your company size'
    });
  }

  public render(q: Quark): void {
    $(q, 'div', 'login-view', {}, q => {
        $(q, 'div', 'login-left', {}, q => {
            $(q, 'img', 'login-icon-image', { src: 'assets/xployt-logo.png' });
            $(q, 'p', 'login-description', {}, 
                'Register to access exclusive features and more');
        });
        $(q, 'div', 'login-container', {}, q => {
            $(q, 'h1', 'login-title', {}, 'Sign up');
            
            this.nameField.render(q);
            this.emailField.render(q);
            this.passwordField.render(q);
            this.confirmPasswordField.render(q);
            this.companyNameField.render(q);
            this.companyDomainField.render(q);
            this.companySizeField.render(q);

            $(q, 'div', 'login-button-container', {}, q => {
                this.registerButton.render(q);
            });
        });
    })
  }

  private handleRegister(): void {
    const name = this.nameField.getValue();
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();
    const confirmPassword = this.confirmPasswordField.getValue();
    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    console.log('Registration attempt:', { name, email, password });
  }
}

export const registerViewHandler = new ViewHandler('', RegisterView)

