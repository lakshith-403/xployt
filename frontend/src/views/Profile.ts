import { Quark, QuarkFunction as $ } from "../ui_lib/quark";
import { View, ViewHandler } from "../ui_lib/view";
import { TextField } from "../components/text_field/base";
import { IconButton } from "../components/button/icon.button";
import { Button, ButtonType } from "../components/button/base";
import "./Profile.scss";
import { CollapsibleBase } from "../components/Collapsible/collap.base";
import { ProfileService } from '../services/profile.service';

export class ProfileView extends View {
  private userInfoCollapsible: CollapsibleBase;
  private fundsCollapsible: CollapsibleBase;
  private profile: any = null;
  private nameField: TextField;
  private emailField: TextField;
  private phoneField: TextField;

  constructor() {
    super();
    this.userInfoCollapsible = new CollapsibleBase("User Info", "user-info");
    this.fundsCollapsible = new CollapsibleBase("Funds", "funds");
    
    // Initialize text fields
    this.nameField = new TextField({ label: 'Name' });
    this.emailField = new TextField({ label: 'Email', type: 'email' });
    this.phoneField = new TextField({ label: 'Phone Number', type: 'tel' });
    
    // Load profile data when component is created
    this.loadProfile();
  }

  private async loadProfile() {
    try {
      const response = await ProfileService.getProfile();
      if (response.success) {
        this.profile = response.data;
        this.updateFields();
        this.render(document.createElement('div')); 
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  private updateFields() {
    if (this.profile) {
      this.nameField.setValue(this.profile.name);
      this.emailField.setValue(this.profile.email);
      this.phoneField.setValue(this.profile.phoneNumber);
    }
  }

  private async saveChanges() {
    try {
      const profileData = {
        name: this.nameField.getValue(),
        email: this.emailField.getValue(),
        phoneNumber: this.phoneField.getValue()
      };
      
      const response = await ProfileService.updateProfile(profileData);
      if (response.success) {
        // TODO: Show success message
        this.loadProfile(); // Reload profile data
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  public render(q: Quark): void {
    $(q, 'div', 'profile-view', {}, (q) => {
      // Header row
      $(q, 'div', 'profile-header', {}, (q) => {
        $(q, 'h1', '', {}, `Hello ${this.profile?.name || 'Lakshith'}!`);
        $(q, 'div', 'profile-picture-container', {}, (q) => {
          $(q, 'img', 'profile-picture', { 
            src: this.profile?.profilePicture || 'https://picsum.photos/id/237/200/300', 
            alt: '' 
          });
          
          $(q, 'div', 'profile-picture-button-container', {}, (q) => {
            new IconButton({
              label: '',
              icon: 'fa fa-camera',
              onClick: async () => {
                // TODO: Implement profile picture upload
                console.log('Change profile picture');
              },
            }).render(q);
          });
        });
      });

      this.userInfoCollapsible.render(q);
      this.fundsCollapsible.render(q);
    });

    $(this.userInfoCollapsible.content!, 'div', 'user-info-content', {}, (q) => {
      $(q, 'div', 'profile-details', {}, (q) => {
        this.nameField.render(q);
        this.emailField.render(q);
        this.phoneField.render(q);
      });

      // Save button
      $(q, 'div', 'save-button-container', {}, (q) => {
        new Button({
          label: 'Save Changes',
          type: ButtonType.PRIMARY,
          onClick: () => this.saveChanges(),
        }).render(q);
      });
    });

    $(this.fundsCollapsible.content!, 'div', 'funds-content', {}, (q) => {
      $(q, 'div', 'funds-details', {}, (q) => {
        $(q, 'div', 'fund-box', {}, (q) => {
          $(q, 'h2', 'title', {}, 'Amount Remaining');
          $(q, 'p', 'amount', {}, `$${this.profile?.fundsRemaining || '1000'}`);
        });

        $(q, 'div', 'fund-box', {}, (q) => {
          $(q, 'h2', 'title', {}, 'Amount Spent');
          $(q, 'p', 'amount', {}, `$${this.profile?.fundsSpent || '1300'}`);
        });

        $(q, 'div', 'fund-box button-container', {}, (q) => {
          new Button({
            label: 'Add Funds',
            type: ButtonType.PRIMARY,
            onClick: () => console.log('Add funds'),
          }).render(q);

          new Button({
            label: 'View Transactions',
            type: ButtonType.SECONDARY,
            onClick: () => console.log('Withdraw funds'),
          }).render(q);
        });
      });
    });
  }
}

export const profileViewHandler = new ViewHandler('', ProfileView);