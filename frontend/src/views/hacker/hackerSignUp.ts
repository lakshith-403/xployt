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
      name: 'companyName',
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
      name: 'linkedIn',
    }),
  };

  render(q: Quark): void {
    $(q, 'div', 'hacker-signup', {}, (q) => {
      $(q, 'h1', '', {}, 'Hacker Sign Up');
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.email.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.password.render(q);
      });
      $(q, 'div', 'form-field', {}, (q) => {
        this.fields.username.render(q);
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
          const requiredFields = ['email', 'password', 'username', 'firstName', 'lastName', 'phone', 'dob'];
          const emptyFields = requiredFields.filter((field) => !this.fields[field].getValue());

          if (emptyFields.length > 0) {
            setContent(modalAlertOnlyOK, {
              '.modal-title': 'Error',
              '.modal-message': 'Failed to sign up. Please fill in all the fields.',
            });
            modalManager.show('alertOnlyOK', modalAlertOnlyOK);
            return;
          }

          console.log('Submitting with skills:', this.skills);

          try {
            const formData = new FormData();
            formData.append('email', this.fields.email.getValue());
            formData.append('password', this.fields.password.getValue());
            formData.append('username', this.fields.username.getValue());
            formData.append('firstName', this.fields.firstName.getValue());
            formData.append('lastName', this.fields.lastName.getValue());
            formData.append('phone', this.fields.phone.getValue());
            formData.append('dob', this.fields.dob.getValue());
            formData.append('linkedIn', this.fields.linkedIn.getValue());
            formData.append('companyName', this.fields.companyName.getValue());
            formData.append('skills', JSON.stringify(this.skills));

            // const certificateFiles = this.certificateField.getElement().files;
            // if (certificateFiles) {
            //   for (let i = 0; i < certificateFiles.length; i++) {
            //     formData.append('certificates', certificateFiles[i]);
            //   }
            // }

            const response = await NETWORK.post('/api/register', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
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
            setContent(modalAlertOnlyOK, {
              '.modal-title': 'Error',
              '.modal-message': 'Registration failed. Please try again.',
            });
            modalManager.show('alertOnlyOK', modalAlertOnlyOK);
          }
        },
      }).render(q);
    });
  }
}

export const hackerSignUpViewHandler = new ViewHandler('/hacker', HackerSignUp);
