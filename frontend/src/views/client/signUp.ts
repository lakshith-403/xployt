import { setContent } from "@/components/ModalManager/ModalManager";
import modalManager from "@/components/ModalManager/ModalManager";
import { modalAlertOnlyOK } from "@/main";
import { FormTextField } from "@/components/text_field/form.text_field";
import { QuarkFunction as $, Quark } from "@/ui_lib/quark";
import { View, ViewHandler } from "@/ui_lib/view";
import NETWORK from "@/data/network/network";
import { router } from "@/ui_lib/router";
import { Button } from "@/components/button/base";
import './signUp.scss';

class ClientSignUp extends View {
  constructor() {
    super();
    this.errorMessage = '';
    this.isLoading = false;
  }

  private errorMessage: string;
  private isLoading: boolean;

  private fields: { [key: string]: FormTextField } = {
    email: new FormTextField({
      label: 'Email',
      placeholder: 'Enter your email',
      name: 'email',
      type: 'email',
    }),
    password: new FormTextField({
      label: 'Password',
      placeholder: 'Enter your password',
      name: 'password',
      type: 'password',
    }),
    username: new FormTextField({
      label: 'Username',
      placeholder: 'Enter your username',
      name: 'username',
    }),
    firstName: new FormTextField({
      label: 'First Name',
      placeholder: 'Enter your first name',
      name: 'firstName',
    }),
    lastName: new FormTextField({
      label: 'Last Name',
      placeholder: 'Enter your last name',
      name: 'lastName',
    }),
    phone: new FormTextField({
      label: 'Phone Number',
      placeholder: 'Enter your phone number',
      name: 'phone',
    }),
    companyName: new FormTextField({
      label: 'Company Name',
      placeholder: 'Enter your company name',
      name: 'companyName'
    }),
    dob: new FormTextField({
      label: 'Date of Birth',
      placeholder: 'YYYY-MM-DD',
      name: 'dob',
      type: 'date',
    }),
    linkedIn: new FormTextField({
      label: 'LinkedIn Profile',
      placeholder: 'Enter your LinkedIn profile URL',
      name: 'linkedIn'
    })
  };

  private validateField(fieldName: string): boolean {
    const field = this.fields[fieldName];
    const value = field.getValue();

    // if (field.props.required && !value) {
    //   return false;
    // }

    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }

    if (fieldName === 'password' && value) {
      return value.length >= 8;
    }

    return true;
  }

  private updateErrorMessage(message: string): void {
    this.errorMessage = message;
    const errorElement = document.querySelector('.error-message');
    if (errorElement) {
      if (message) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
      } else {
        errorElement.classList.add('hidden');
      }
    }
  }

  private toggleLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    const button = document.querySelector('.submit-button button') as HTMLButtonElement;
    if (button) {
      button.disabled = isLoading;
      button.textContent = isLoading ? 'Processing...' : 'Sign Up';
    }
  }

  render(q: Quark): void {
    $(q, 'div', 'client-signup', {}, (q) => {
      $(q, 'h1', '', {}, 'Create Your Account');

      $(q, 'p', 'signup-intro', {}, 'Join our platform to access exclusive features and services.');

      $(q, 'div', 'error-message hidden', {}, this.errorMessage);

      $(q, 'div', 'form-container', {}, (q) => {
        // Personal Information Section
        $(q, 'div', 'form-section', {}, (q) => {
          $(q, 'h2', 'section-title', {}, 'Personal Information');

          $(q, 'div', 'form-row', {}, (q) => {
            $(q, 'div', 'form-field', {}, (q) => {
              this.fields.firstName.render(q);
            });

            $(q, 'div', 'form-field', {}, (q) => {
              this.fields.lastName.render(q);
            });
          });

          $(q, 'div', 'form-row', {}, (q) => {
            $(q, 'div', 'form-field', {}, (q) => {
              this.fields.username.render(q);
            });

            $(q, 'div', 'form-field', {}, (q) => {
              this.fields.dob.render(q);
            });
          });
        });

        // Account Information Section
        $(q, 'div', 'form-section', {}, (q) => {
          $(q, 'h2', 'section-title', {}, 'Account Information');

          $(q, 'div', 'form-row', {}, (q) => {
            $(q, 'div', 'form-field', {}, (q) => {
              this.fields.email.render(q);
            });

            $(q, 'div', 'form-field', {}, (q) => {
              this.fields.password.render(q);
            });
          });
        });

        // Contact Information Section
        $(q, 'div', 'form-section', {}, (q) => {
          $(q, 'h2', 'section-title', {}, 'Contact Information');

          $(q, 'div', 'form-row', {}, (q) => {
            $(q, 'div', 'form-field', {}, (q) => {
              this.fields.phone.render(q);
            });

            $(q, 'div', 'form-field', {}, (q) => {
              this.fields.linkedIn.render(q);
            });
          });

          $(q, 'div', 'form-row', {}, (q) => {
            $(q, 'div', 'form-field', {}, (q) => {
              this.fields.companyName.render(q);
            });
          });
        });
      });

      $(q, 'div', 'submit-button', {}, (q) => {
        $(q, 'div', 'terms', {}, (q) => {
          $(q, 'p', '', {}, 'By signing up, you agree to our ');
          $(q, 'a', '', { href: '/terms' }, 'Terms of Service');
          // $(q, ' and ');
          $(q, 'a', '', { href: '/privacy' }, 'Privacy Policy');
        });

        new Button({
          label: 'Sign Up',
          onClick: async () => {
            if (this.isLoading) return;

            const requiredFields = ['email', 'password', 'username', 'firstName', 'lastName', 'phone', 'dob'];
            const invalidFields = requiredFields.filter(field => !this.validateField(field));

            if (invalidFields.length > 0) {
              this.updateErrorMessage('Please fill in all required fields correctly.');

              // Highlight the first invalid field
              const firstInvalidField = invalidFields[0];
              const fieldElement = document.querySelector(`[name="${firstInvalidField}"]`) as HTMLElement;
              if (fieldElement) {
                fieldElement.focus();
                fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }

              return;
            }

            this.updateErrorMessage('');
            this.toggleLoading(true);

            try {
              const response = await NETWORK.post('/api/clientRegister', {
                email: this.fields.email.getValue(),
                password: this.fields.password.getValue(),
                username: this.fields.username.getValue(),
                firstName: this.fields.firstName.getValue(),
                lastName: this.fields.lastName.getValue(),
                phone: this.fields.phone.getValue(),
                dob: this.fields.dob.getValue(),
                linkedIn: this.fields.linkedIn.getValue(),
                companyName: this.fields.companyName.getValue(),
              }, {
                successCallback: () => {
                  setContent(modalAlertOnlyOK, {
                    '.modal-title': 'Success',
                    '.modal-message': 'Your account has been created successfully! Redirecting to login...'
                  });
                  modalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
                    router.navigateTo('/login');
                  });
                }
              });

            } catch (error) {
              console.error('Registration failed:', error);
              this.updateErrorMessage('Registration failed. Please check your information and try again.');
            } finally {
              this.toggleLoading(false);
            }
          }
        }).render(q);
      });

      $(q, 'div', 'login-link', {}, (q) => {
        $(q, 'p', '', {}, 'Already have an account? ');
        $(q, 'a', '', {
          href: '#',
          events: {
            click: (e: Event) => {
              e.preventDefault();
              router.navigateTo('/login');
            }
          }
        }, 'Log in');
      });
    });
  }
}

export const clientSignUpViewHandler = new ViewHandler('/client', ClientSignUp);