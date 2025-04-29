import { setContent } from '@/components/ModalManager/ModalManager';
import modalManager from '@/components/ModalManager/ModalManager';
import { modalAlertOnlyOK } from '@/main';
import { FormTextField } from '@/components/text_field/form.text_field';
import { QuarkFunction as $, Quark } from '@/ui_lib/quark';
import { View, ViewHandler } from '@/ui_lib/view';
import NETWORK from '@/data/network/network';
import { router } from '@/ui_lib/router';
import { Button } from '@/components/button/base';
import { FileInputBase } from '@/components/input_file/input.file';
import { TagInput } from '@/components/text_field/tagInput/tagInput';
import './hackerSignUp.scss';

class HackerSignUp extends View {
  private skills: string[] = [];
  private availableSkills: { id: number; skill: string }[] = [];
  private certificateField: FileInputBase;
  private skillsInput: TagInput;
  private errorMessage: string = '';
  private isLoading: boolean = false;

  constructor() {
    super();
    this.loadSkills();
    this.certificateField = new FileInputBase({
      label: 'Certificates',
      accept: '.pdf,.jpg,.jpeg,.png',
      multiple: true,
      name: 'certificates',
    });
    this.skillsInput = new TagInput({
      label: 'Skills',
      placeholder: 'Select your skills',
      suggestions: [],
      onChange: (skills) => {
        this.skills = skills;
        console.log('Selected skills:', this.skills);
      },
    });
  }

  private async loadSkills() {
    try {
      const response = await NETWORK.get('/api/hackerSkills');
      if (response.data && response.data.skills) {
        this.availableSkills = response.data.skills.map((skill: any) => ({
          id: skill.id,
          skill: skill.skill,
        }));
        // Update TagInput suggestions with available skills
        this.skillsInput = new TagInput({
          label: 'Skills',
          placeholder: 'Select your skills',
          suggestions: this.availableSkills.map((s) => s.skill),
          onChange: (skills) => {
            this.skills = skills;
            console.log('Selected skills:', this.skills);
          },
        });
        if (this.currentQuark) {
          await this.rerender();
        }
      } else {
        console.error('Invalid skills data format:', response.data);
      }
    } catch (error) {
      console.error('Failed to load skills:', error);
    }
  }

  private fields: { [key: string]: FormTextField } = {
    email: new FormTextField({
      label: 'Email *',
      placeholder: 'Enter your email',
      name: 'email',
      type: 'email',
    }),
    password: new FormTextField({
      label: 'Password *',
      placeholder: 'Enter your password',
      name: 'password',
      type: 'password',
    }),
    firstName: new FormTextField({
      label: 'First Name *',
      placeholder: 'Enter your first name',
      name: 'firstName',
    }),
    lastName: new FormTextField({
      label: 'Last Name *',
      placeholder: 'Enter your last name',
      name: 'lastName',
    }),
    phone: new FormTextField({
      label: 'Phone Number *',
      placeholder: 'Enter your phone number',
      name: 'phone',
    }),
    companyName: new FormTextField({
      label: 'Company Name',
      placeholder: 'Enter your company name',
      name: 'companyName',
    }),
    dob: new FormTextField({
      label: 'Date of Birth *',
      placeholder: 'YYYY-MM-DD',
      name: 'dob',
      type: 'date',
    }),
    linkedIn: new FormTextField({
      label: 'LinkedIn Profile',
      placeholder: 'Enter your LinkedIn profile URL',
      name: 'linkedIn',
    }),
  };

  private validateField(fieldName: string): boolean {
    const field = this.fields[fieldName];
    const value = field.getValue();

    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    }

    if (fieldName === 'password' && value) {
      // Password must be at least 8 characters long and contain at least one number and one letter
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return passwordRegex.test(value);
    }

    if (fieldName === 'phone' && value) {
      // Basic phone number validation (can be adjusted based on requirements)
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      return phoneRegex.test(value);
    }

    if (fieldName === 'dob' && value) {
      // Validate date format and ensure it's not in the future
      const date = new Date(value);
      const today = new Date();
      return !isNaN(date.getTime()) && date <= today;
    }

    if (fieldName === 'linkedIn' && value) {
      // Basic LinkedIn URL validation
      const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
      return linkedInRegex.test(value);
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
    $(q, 'div', 'hacker-signup', {}, (q) => {
      $(q, 'h1', '', {}, 'Hacker Sign Up');
      $(q, 'div', 'error-message hidden', {}, this.errorMessage);
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.email.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.password.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.firstName.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.lastName.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.phone.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.companyName.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.dob.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.linkedIn.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.certificateField.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.skillsInput.render(q);
      });
    });

    $(q, 'div', 'submit-button', {}, (q) => {
      new Button({
        label: 'Sign Up',
        onClick: async () => {
          if (this.isLoading) return;

          const requiredFields = ['email', 'password', 'firstName', 'lastName', 'phone', 'dob'];
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

          if (this.skills.length === 0) {
            this.updateErrorMessage('Please select at least one skill.');
            return;
          }

          this.updateErrorMessage('');
          this.toggleLoading(true);

          try {
            const formData = new FormData();
            formData.append('email', this.fields.email.getValue());
            formData.append('password', this.fields.password.getValue());
            formData.append('firstName', this.fields.firstName.getValue());
            formData.append('lastName', this.fields.lastName.getValue());
            formData.append('phone', this.fields.phone.getValue());
            formData.append('dob', this.fields.dob.getValue());
            formData.append('linkedIn', this.fields.linkedIn.getValue());
            formData.append('companyName', this.fields.companyName.getValue());
            formData.append('skills', JSON.stringify(this.skills));

            const certificateFiles = this.certificateField.getFiles();
            if (certificateFiles.length > 0) {
              for (let i = 0; i < certificateFiles.length; i++) {
                formData.append('certificates', certificateFiles[i]);
              }
            }

            const response = await NETWORK.post('/api/register', formData, {
              dataTransferType: 'multipart/form-data',
              successCallback: () => {
                setContent(modalAlertOnlyOK, {
                  '.modal-title': 'Success',
                  '.modal-message': 'Registration successful!',
                });
                modalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
                  router.navigateTo('/');
                });
              },
            });
          } catch (error) {
            console.error('Registration failed:', error);
            this.updateErrorMessage('Registration failed. Please try again.');
          } finally {
            this.toggleLoading(false);
          }
        },
      }).render(q);
    });
  }
}

export const hackerSignUpViewHandler = new ViewHandler('/hacker', HackerSignUp);
