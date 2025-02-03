import { View, ViewHandler } from '../ui_lib/view';
import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { TextField } from '../components/text_field/base';
import { Button, ButtonType } from '../components/button/base';
import { UserCache, UserType } from '@/data/user';
import { router } from '@/ui_lib/router';
import { CACHE_STORE } from '@/data/cache';
import { setContent } from '@/components/ModalManager/ModalManager';
import ModalManager from '@/components/ModalManager/ModalManager';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';

export class RegisterView extends View {
  private nameField: TextField;
  private emailField: TextField;
  private passwordField: TextField;
  private confirmPasswordField: TextField;
  private companyNameField: TextField;
  private companyDomainField: TextField;
  private companySizeField: TextField;
  private registerButton: Button;
  private roleSelect!: HTMLSelectElement;

  private userCache: UserCache;

  constructor() {
    super();
    this.nameField = new TextField({
      label: '',
      placeholder: 'Enter your name',
    });
    this.emailField = new TextField({
      label: '',
      placeholder: 'Enter your email',
    });
    this.passwordField = new TextField({
      label: '',
      placeholder: 'Enter your password',
      type: 'password',
    });
    this.confirmPasswordField = new TextField({
      label: '',
      placeholder: 'Confirm your password',
      type: 'password',
    });
    this.registerButton = new Button({
      label: 'Register',
      onClick: this.handleRegister.bind(this),
      type: ButtonType.PRIMARY,
    });
    this.companyNameField = new TextField({
      label: '',
      placeholder: 'Enter your company name',
    });
    this.companyDomainField = new TextField({
      label: '',
      placeholder: 'Enter your company domain',
    });
    this.companySizeField = new TextField({
      label: '',
      placeholder: 'Enter your company size',
    });

    this.userCache = CACHE_STORE.getUser();
  }

  public render(q: Quark): void {
    $(q, 'div', 'login-view', {}, (q) => {
      $(q, 'div', 'login-left', {}, (q) => {
        $(q, 'img', 'login-icon-image', { src: 'assets/xployt-logo.png' });
        $(q, 'p', 'login-description', {}, 'Register to access exclusive features and more');
      });
      $(q, 'div', 'login-container', {}, (q) => {
        $(q, 'h1', 'login-title', {}, 'Sign up');

        this.nameField.render(q);
        this.emailField.render(q);
        this.passwordField.render(q);
        this.confirmPasswordField.render(q);
        // this.companyNameField.render(q);
        // this.companyDomainField.render(q);
        // this.companySizeField.render(q);

        $(q, 'select', 'role-select', {}, (q) => {
          this.roleSelect = q as HTMLSelectElement;
          this.roleSelect.innerHTML = `
            <option value="Client">Client</option>
            <option value="Validator">Validator</option>
            <option value="ProjectLead">Lead</option>
            <option value="Hacker">Hacker</option>
          `;
        });

        $(q, 'div', 'login-button-container', {}, (q) => {
          this.registerButton.render(q);

          new Button({
            label: 'Sign in',
            type: ButtonType.SECONDARY,
            onClick: () => router.navigateTo('/login'),
          }).render(q);
        });
      });
    });
  }

  private handleRegister(): void {
    const name = this.nameField.getValue();
    const email = this.emailField.getValue();
    const password = this.passwordField.getValue();
    const confirmPassword = this.confirmPasswordField.getValue();
    const role = this.roleSelect.value as UserType;

    if (password !== confirmPassword) {
      console.error('Passwords do not match');
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Error',
        '.modal-message': 'Passwords do not match',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      return;
    }

    if (name === '' || email === '' || password === '' || confirmPassword === '') {
      console.error('All fields are required');
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Error',
        '.modal-message': 'Name, Email, Password and Confirm Password fields are required',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format');
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Error',
        '.modal-message': 'Invalid email format',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      return;
    }

    this.userCache
      .register(name, email, password, role)
      .then((user) => {
        console.log('User registered:', user);
        setContent(modalAlertOnlyOK, {
          '.modal-title': 'Success',
          '.modal-message': 'User registered successfully',
        });
        ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
          router.navigateTo('/login');
        });
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        // alert('Error registering user');
        setContent(modalAlertForErrors, {
          '.modal-title': 'Error',
          '.modal-message': `Failed to register user: ${error.message}`,
          '.modal-data': error.data,
          '.modal-servletClass': error.servlet,
          '.modal-uri': error.uri,
        });
        ModalManager.show('alertForErrors', modalAlertForErrors);
      });
  }
}

export const registerViewHandler = new ViewHandler('', RegisterView);
