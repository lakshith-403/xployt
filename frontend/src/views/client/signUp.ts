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

  private validateField(fieldName: string): { isValid: boolean; message: string } {
    const field = this.fields[fieldName];
    const value = field.getValue();

    if (!value) {
      return { 
        isValid: false, 
        message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` 
      };
    }

    if (fieldName === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { 
          isValid: false, 
          message: 'Please enter a valid email address' 
        };
      }
    }

    if (fieldName === 'password') {
      if (value.length < 8) {
        return { 
          isValid: false, 
          message: 'Password must be at least 8 characters long' 
        };
      }
      if (!/[A-Z]/.test(value)) {
        return { 
          isValid: false, 
          message: 'Password must contain at least one uppercase letter' 
        };
      }
      if (!/[a-z]/.test(value)) {
        return { 
          isValid: false, 
          message: 'Password must contain at least one lowercase letter' 
        };
      }
      if (!/[0-9]/.test(value)) {
        return { 
          isValid: false, 
          message: 'Password must contain at least one number' 
        };
      }
    }

    if (fieldName === 'phone') {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(value)) {
        return { 
          isValid: false, 
          message: 'Please enter a valid phone number (minimum 10 digits)' 
        };
      }
    }

    if (fieldName === 'dob') {
      const date = new Date(value);
      const today = new Date();
      if (isNaN(date.getTime())) {
        return { 
          isValid: false, 
          message: 'Please enter a valid date' 
        };
      }
      if (date > today) {
        return { 
          isValid: false, 
          message: 'Date of birth cannot be in the future' 
        };
      }
    }

    if (fieldName === 'linkedIn' && value) {
      const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
      if (!linkedInRegex.test(value)) {
        return { 
          isValid: false, 
          message: 'Please enter a valid LinkedIn profile URL' 
        };
      }
    }

    return { isValid: true, message: '' };
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
          $(q, 'a', '', { href: '/privacy' }, 'Privacy Policy');
        });

        new Button({
          label: 'Sign Up',
          onClick: async () => {
            if (this.isLoading) return;

            const requiredFields = ['email', 'password', 'firstName', 'lastName', 'phone', 'dob'];
            let firstInvalidField = '';
            let errorMessage = '';

            // Check each required field
            for (const field of requiredFields) {
              const validation = this.validateField(field);
              if (!validation.isValid) {
                firstInvalidField = field;
                errorMessage = validation.message;
                break;
              }
            }

            // Check optional fields if they have values
            if (!errorMessage) {
              const optionalFields = ['linkedIn'];
              for (const field of optionalFields) {
                const value = this.fields[field].getValue();
                if (value) {
                  const validation = this.validateField(field);
                  if (!validation.isValid) {
                    firstInvalidField = field;
                    errorMessage = validation.message;
                    break;
                  }
                }
              }
            }

            if (errorMessage) {
              this.updateErrorMessage(errorMessage);
              
              // Highlight the invalid field
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
              // Validate all fields before sending
              const formData = {
                email: this.fields.email.getValue().trim(),
                password: this.fields.password.getValue().trim(),
                firstName: this.fields.firstName.getValue().trim(),
                lastName: this.fields.lastName.getValue().trim(),
                phone: this.fields.phone.getValue().trim(),
                dob: this.fields.dob.getValue().trim(),
                companyName: this.fields.companyName.getValue()?.trim() || '',
                linkedIn: this.fields.linkedIn.getValue()?.trim() || ''
              };

              // Log the data being sent
              console.log('Sending registration data:', formData);

              // Validate required fields
              const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

              if (missingFields.length > 0) {
                this.updateErrorMessage(`Missing required fields: ${missingFields.join(', ')}`);
                return;
              }

              const response = await NETWORK.post('/api/clientRegister', formData, {
                showLoading: true,
                handleError: true,
                successCallback: (response: any) => {
                  console.log('Registration successful:', response);
                  setContent(modalAlertOnlyOK, {
                    '.modal-title': 'Success',
                    '.modal-message': 'Your account has been created successfully! Redirecting to login...'
                  });
                  modalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
                    router.navigateTo('/login');
                  });
                }
              });

            } catch (error: any) {
              console.error('Registration failed:', error);
              console.error('Error details:', {
                status: error.status,
                statusText: error.statusText,
                data: error.data,
                message: error.message
              });

              let errorMessage = 'Registration failed. Please try again.';
              
              if (error.data) {
                if (typeof error.data === 'string') {
                  errorMessage = error.data;
                } else if (error.data.message) {
                  errorMessage = error.data.message;
                } else if (error.data.error) {
                  errorMessage = error.data.error;
                } else if (error.data.required) {
                  errorMessage = `Missing required fields: ${error.data.required.join(', ')}`;
                }
              } else if (error.message) {
                errorMessage = error.message;
              }
              
              this.updateErrorMessage(errorMessage);
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