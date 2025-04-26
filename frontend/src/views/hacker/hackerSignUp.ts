import { setContent } from "@/components/ModalManager/ModalManager";
import modalManager from "@/components/ModalManager/ModalManager";
import { modalAlertOnlyOK } from "@/main";
import { FormTextField } from "@/components/text_field/form.text_field";
import { QuarkFunction as $, Quark } from "@/ui_lib/quark";
import { View, ViewHandler } from "@/ui_lib/view";
import NETWORK from "@/data/network/network";
import { router } from "@/ui_lib/router";
import { Button } from "@/components/button/base";
import { FileInputBase } from "@/components/input_file/input.file";

class HackerSignUp extends View {
  private skills: string[] = [];
  private availableSkills: { id: number; skill: string }[] = [];
  private certificateField: FileInputBase;

  constructor() {
    super();
    this.loadSkills();
    this.certificateField = new FileInputBase({
      label: 'Certificates',
      accept: '.pdf,.jpg,.jpeg,.png',
      multiple: true,
      name: 'certificates'
    });
  }

  private async loadSkills() {
    try {
      const response = await NETWORK.get('/api/hackerSkills');
      if (response.data && response.data.skills) {
        this.availableSkills = response.data.skills.map((skill: any) => ({
          id: skill.id,
          skill: skill.skill
        }));
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
      type: 'email'
    }),
    password: new FormTextField({ 
      label: 'Password *', 
      placeholder: 'Enter your password',
      name: 'password',
      type: 'password'
    }),
    username: new FormTextField({ 
      label: 'Username', 
      placeholder: 'Enter your username',
      name: 'username'
    }),
    firstName: new FormTextField({ 
      label: 'First Name', 
      placeholder: 'Enter your first name',
      name: 'firstName'
    }),
    lastName: new FormTextField({ 
      label: 'Last Name', 
      placeholder: 'Enter your last name',
      name: 'lastName'
    }),
    phone: new FormTextField({ 
      label: 'Phone Number', 
      placeholder: 'Enter your phone number',
      name: 'phone'
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
      type: 'date'
    }),
    linkedIn: new FormTextField({ 
      label: 'LinkedIn Profile', 
      placeholder: 'Enter your LinkedIn profile URL',
      name: 'linkedIn'
    })
  };

  private renderSkills(q: Quark): void {
    $(q, 'div', 'skills-container', {}, (q) => {
      $(q, 'h3', '', {}, 'Select Your Skills');
      $(q, 'div', 'skills-grid', {}, (q) => {
        if (this.availableSkills.length === 0) {
          $(q, 'div', 'no-skills', {}, 'Loading skills...');
          return;
        }
        
        this.availableSkills.forEach(skill => {
          $(q, 'div', 'skill-item', {}, (q) => {
            const isChecked = this.skills.includes(skill.skill);
            $(q, 'input', '', {
              type: 'checkbox',
              id: `skill-${skill.id}`,
              checked: isChecked
            }, (q) => {
              const inputElement = q as unknown as HTMLInputElement;
              // Set initial state
              inputElement.checked = isChecked;
              
              inputElement.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                if (target.checked) {
                  if (!this.skills.includes(skill.skill)) {
                    this.skills.push(skill.skill);
                  }
                } else {
                  this.skills = this.skills.filter(s => s !== skill.skill);
                }
                console.log('Current skills:', this.skills); // Debug log
              });
            });
            $(q, 'label', '', { for: `skill-${skill.id}` }, skill.skill);
          });
        });
      });
    });
  }

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
      this.renderSkills(q);
    });

    $(q, 'div', 'submit-button', {}, (q) => {
      new Button({     
        label: 'Sign Up',
        onClick: async () => {
          const requiredFields = ['email', 'password', 'username', 'firstName', 'lastName', 'phone', 'dob'];
          const emptyFields = requiredFields.filter(field => !this.fields[field].getValue());
          
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

            const certificateFiles = this.certificateField.getElement().files;
            if (certificateFiles) {
              for (let i = 0; i < certificateFiles.length; i++) {
                formData.append('certificates', certificateFiles[i]);
              }
            }

            const response = await NETWORK.post('/api/register', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              successCallback: () => {
                setContent(modalAlertOnlyOK, {
                  '.modal-title': 'Success',
                  '.modal-message': 'Registration successful!'
                });
                modalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
                  router.navigateTo('/');
                }); 
              } 
            });   
      
          } catch (error) {
            console.error('Registration failed:', error);
            setContent(modalAlertOnlyOK, {
              '.modal-title': 'Error',
              '.modal-message': 'Registration failed. Please try again.'
            });
            modalManager.show('alertOnlyOK', modalAlertOnlyOK);
          }
        }
      }).render(q);
    });
  }
}

export const hackerSignUpViewHandler = new ViewHandler('/register', HackerSignUp);
