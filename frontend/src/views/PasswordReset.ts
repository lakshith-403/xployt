import { View, ViewHandler } from '../ui_lib/view';
import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { TextField } from '../components/text_field/base';
import { Button, ButtonType } from '../components/button/base';
import { UserCache } from '@/data/user';
import { router } from '@/ui_lib/router';
import NETWORK, { NetworkError } from '@/data/network/network';
import { CACHE_STORE } from '@/data/cache';
import ModalManager, { convertToDom, setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertOnlyOK } from '../main';

export class PasswordResetView extends View {
  private emailField: TextField;
  private codeField: TextField;
  private newPasswordField: TextField;
  private confirmPasswordField: TextField;
  private requestCodeButton: Button;
  private resetPasswordButton: Button;
  private userCache: UserCache;
  private currentUser: any;

  constructor() {
    super();
    this.emailField = new TextField({
      label: '',
      placeholder: 'Enter your email',
    });
    this.codeField = new TextField({
      label: '',
      placeholder: 'Enter recovery code',
    });
    this.newPasswordField = new TextField({
      label: '',
      placeholder: 'Enter new password',
      type: 'password',
    });
    this.confirmPasswordField = new TextField({
      label: '',
      placeholder: 'Confirm new password',
      type: 'password',
    });
    this.requestCodeButton = new Button({
      label: 'Request Recovery Code',
      onClick: this.handleRequestCode.bind(this),
      type: ButtonType.SECONDARY,
    });
    this.resetPasswordButton = new Button({
      label: 'Reset Password',
      onClick: this.handleResetPassword.bind(this),
      type: ButtonType.PRIMARY,
    });

    this.userCache = CACHE_STORE.getUser();
  }

  public async onMount(): Promise<void> {
    // Check if user is signed in
    try {
      this.currentUser = await this.userCache.load();
      // If user is Guest type, consider them not logged in
      if (this.currentUser.type === 'Guest') {
        this.currentUser = null;
      }
    } catch (error) {
      // User is not logged in
      this.currentUser = null;
    }
  }

  public render(q: Quark): void {
    $(q, 'div', 'login-view', {}, (q) => {
      $(q, 'div', 'login-left', {}, (q) => {
        const loginIcon = $(q, 'img', 'login-icon-image', { src: 'assets/xployt-logo.png' });
        loginIcon.onclick = () => router.navigateTo('/');

        $(q, 'p', 'login-description', {}, '');
      });
      $(q, 'div', 'login-container', {}, (q) => {
        $(q, 'h1', 'login-title', {}, this.currentUser ? 'Change Password' : 'Reset Password');

        if (this.currentUser) {
          // Signed-in user view
          $(q, 'div', 'email-display', {}, (q) => {
            $(q, 'p', '', {}, `Email: ${this.currentUser.email}`);
          });

          this.newPasswordField.render(q);
          this.confirmPasswordField.render(q);

          $(q, 'div', 'login-button-container', {}, (q) => {
            this.resetPasswordButton.render(q);

            new Button({
              label: 'Back to Dashboard',
              type: ButtonType.SECONDARY,
              onClick: () => router.navigateTo('/dashboard'),
            }).render(q);
          });
        } else {
          // Not signed in - recovery flow
          $(q, 'div', 'reset-section', {}, (q) => {
            $(q, 'h3', 'section-title', {}, 'Step 1: Request Recovery Code');
            this.emailField.render(q);

            $(q, 'div', 'login-button-container', {}, (q) => {
              this.requestCodeButton.render(q);
            });
          });

          $(q, 'div', 'reset-section', {}, (q) => {
            $(q, 'h3', 'section-title', {}, 'Step 2: Reset Password');
            this.codeField.render(q);
            this.newPasswordField.render(q);
            this.confirmPasswordField.render(q);

            $(q, 'div', 'login-button-container', {}, (q) => {
              this.resetPasswordButton.render(q);

              new Button({
                label: 'Back to Login',
                type: ButtonType.SECONDARY,
                onClick: () => router.navigateTo('/login'),
              }).render(q);
            });
          });
        }
      });
    });
  }

  private handleRequestCode(): void {
    const email = this.emailField.getValue();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Error',
        '.modal-message': 'Invalid email format. Please enter a valid email.',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      return;
    }

    // Make API call to request recovery code
    NETWORK.post('/api/auth/password/reset', { email })
      .then((response) => {
        console.log('Response:', response);
        if (response.code != 200) {
          throw new Error(response.message || 'Failed to send recovery code');
        }
        return response;
      })
      .then((data) => {
        setContent(modalAlertOnlyOK, {
          '.modal-title': 'Success',
          '.modal-message': data.message,
        });
        ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      })
      .catch((error) => {
        console.error('Error requesting recovery code:', error);
        setContent(modalAlertOnlyOK, {
          '.modal-title': 'Error',
          '.modal-message': error.message || 'Error requesting recovery code. Please try again.',
        });
        ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      });
  }

  private handleResetPassword(): void {
    const newPassword = this.newPasswordField.getValue();
    const confirmPassword = this.confirmPasswordField.getValue();

    if (newPassword !== confirmPassword) {
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Error',
        '.modal-message': 'Passwords do not match. Please try again.',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      return;
    }

    if (newPassword.length < 6) {
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Error',
        '.modal-message': 'Password must be at least 6 characters long.',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      return;
    }

    const requestData: any = {
      newPassword,
    };

    // Add email and recovery code for non-logged in users
    if (!this.currentUser) {
      const email = this.emailField.getValue();
      const recoveryCode = this.codeField.getValue();

      if (!email || !recoveryCode) {
        setContent(modalAlertOnlyOK, {
          '.modal-title': 'Error',
          '.modal-message': 'Email and recovery code are required.',
        });
        ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
        return;
      }

      requestData.email = email;
      requestData.recoveryCode = recoveryCode;
    }

    // Make API call to change password
    NETWORK.post('/api/auth/password/change', requestData)
      .then((response) => {
        if (response.code != 200) {
          throw new Error(response.message || 'Failed to reset password');
        }
        return response;
      })
      .then((data) => {
        setContent(modalAlertOnlyOK, {
          '.modal-title': 'Success',
          '.modal-message': 'Password has been reset successfully.',
        });

        // Show modal and navigate after user acknowledges
        ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
          if (this.currentUser) {
            router.navigateTo('/dashboard');
          } else {
            router.navigateTo('/login');
          }
        });
      })
      .catch((error) => {
        console.error('Error resetting password:', error);
        setContent(modalAlertOnlyOK, {
          '.modal-title': 'Error',
          '.modal-message': error.message || 'Error resetting password. Please try again.',
        });
        ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      });
  }
}

export const passwordResetViewHandler = new ViewHandler('', PasswordResetView);
