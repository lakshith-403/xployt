import { setContent } from "@/components/ModalManager/ModalManager";
import modalManager from "@/components/ModalManager/ModalManager";
import { modalAlertOnlyOK } from "@/main";
import { FormTextField } from "@/components/text_field/form.text_field";
import { QuarkFunction as $, Quark } from "@/ui_lib/quark";
import { View, ViewHandler } from "@/ui_lib/view";
import NETWORK from "@/data/network/network";
import { router } from "@/ui_lib/router";
import { Button } from "@/components/button/base";

class ClientSignUp extends View {
  constructor() {
    super();
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

  render(q: Quark): void {
    $(q, 'div', 'client-signup', {}, (q) => {
      $(q, 'h1', '', {}, 'Client Sign Up');
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

          try {
            const response = await NETWORK.post('/api/register', {
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

export const clientSignUpViewHandler = new ViewHandler('/register', ClientSignUp);
