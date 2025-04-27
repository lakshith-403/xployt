import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { View, ViewHandler } from '../ui_lib/view';
import { IconButton } from '../components/button/icon.button';
import { Button, ButtonType } from '../components/button/base';
import { CollapsibleBase } from '../components/Collapsible/collap.base';
import { CACHE_STORE } from '../data/cache';
import NETWORK from '@/data/network/network';
import { router } from '@/ui_lib/router';
import { FormTextField } from '@/components/text_field/form.text_field';

export class ProfileView extends View {
  private userInfoCollapsible: CollapsibleBase;
  private roleSpecificCollapsible: CollapsibleBase;

  private profile!: any;
  // Common fields
  private emailField: FormTextField;
  private phoneField: FormTextField;
  private firstNameField: FormTextField;
  private lastNameField: FormTextField;
  private dobField: FormTextField;

  // Role-specific fields
  // Validator/ProjectLead fields
  private skillsField: FormTextField;
  private experienceField: FormTextField;
  private cvLinkField: FormTextField;
  private referenceField: FormTextField;

  // Client fields
  private companyNameField: FormTextField;

  // Hacker fields
  private skillSetContainer: Quark | null = null;
  private skillSetFields: FormTextField[] = [];
  private skillSetValues: string[] = [];

  constructor() {
    super();
    this.userInfoCollapsible = new CollapsibleBase('User Info', 'user-info');
    this.roleSpecificCollapsible = new CollapsibleBase('Role-Specific Info', 'role-specific-info');

    // Common fields
    this.emailField = new FormTextField({ label: 'Email', type: 'email' });
    this.phoneField = new FormTextField({ label: 'Phone Number', type: 'tel' });
    this.firstNameField = new FormTextField({ label: 'First Name' });
    this.lastNameField = new FormTextField({ label: 'Last Name' });
    this.dobField = new FormTextField({ label: 'Date of Birth', type: 'date' });

    // Client fields
    this.companyNameField = new FormTextField({ label: 'Company Name' });

    // Validator/ProjectLead fields
    this.skillsField = new FormTextField({ label: 'Skills' });
    this.experienceField = new FormTextField({ label: 'Experience' });
    this.cvLinkField = new FormTextField({ label: 'CV Link' });
    this.referenceField = new FormTextField({ label: 'References' });
  }

  private async loadProfile() {
    try {
      const user = await CACHE_STORE.getUser().get();
      const response = await NETWORK.get(`/api/new-profile/${user.id}`);
      this.profile = response.data.profile;

      console.log('ProfileView: Raw profile data:', this.profile);

      // Ensure skillSet is properly initialized for Hackers
      if (this.profile.role === 'Hacker') {
        console.log('Raw skillSet from backend:', this.profile.skillSet);
        // Handle both array and string formats
        if (typeof this.profile.skillSet === 'string') {
          this.skillSetValues = [this.profile.skillSet];
        } else if (Array.isArray(this.profile.skillSet)) {
          this.skillSetValues = [...this.profile.skillSet];
        } else {
          this.skillSetValues = [];
        }
        console.log('Processed skillSet values:', this.skillSetValues);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';

    try {
      // Handle ISO date format or database date format (YYYY-MM-DD)
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // Return original if invalid

      // Format to YYYY-MM-DD for input type="date"
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateStr;
    }
  }

  private updateFields() {
    if (this.profile) {
      console.log('ProfileView: Updating fields with profile:', this.profile);

      // Update common fields
      this.emailField.setValue(this.profile.email || '');
      this.phoneField.setValue(this.profile.phone || '');
      this.firstNameField.setValue(this.profile.firstName || '');
      this.lastNameField.setValue(this.profile.lastName || '');

      // Format the date before setting
      const formattedDate = this.formatDate(this.profile.dob);
      console.log('Formatted date:', formattedDate, 'Original:', this.profile.dob);
      this.dobField.setValue(formattedDate);

      // Update role-specific fields
      if (this.profile.role === 'Validator' || this.profile.role === 'ProjectLead') {
        this.skillsField.setValue(this.profile.skills || '');
        this.experienceField.setValue(this.profile.experience || '');
        this.cvLinkField.setValue(this.profile.cvLink || '');
        this.referenceField.setValue(this.profile.reference || '');
      } else if (this.profile.role === 'Client') {
        this.companyNameField.setValue(this.profile.companyName || '');
      } else if (this.profile.role === 'Hacker' && this.profile.skillSet) {
        this.skillSetValues = Array.isArray(this.profile.skillSet) ? this.profile.skillSet : [];
        this.updateSkillSetFields();
      }
    }
  }

  private updateSkillSetFields() {
    if (this.skillSetContainer && this.profile.role === 'Hacker') {
      console.log('Updating skill fields with values:', this.skillSetValues);

      // Clear existing fields
      this.skillSetContainer.innerHTML = '';
      this.skillSetFields = [];

      // Create fields for existing skills
      if (Array.isArray(this.skillSetValues) && this.skillSetValues.length > 0) {
        console.log('Creating fields for skills:', this.skillSetValues);
        this.skillSetValues.forEach((skill, index) => {
          if (skill && skill.trim() !== '') {
            this.addSkillField(this.skillSetContainer!, skill, index);
          }
        });
      } else {
        console.log('No skills to display');
        $(this.skillSetContainer, 'div', 'skill-field-container', {}, (q) => {
          $(q, 'p', 'text-center', {}, 'No skills added yet');
        });
      }

      // Add button for new skill
      $(this.skillSetContainer, 'div', 'add-skill-button-container', {}, (q) => {
        new Button({
          label: 'Add Skill',
          type: ButtonType.SECONDARY,
          onClick: () => {
            this.skillSetValues.push('');
            this.addSkillField(this.skillSetContainer!, '', this.skillSetValues.length - 1);
          },
        }).render(q);
      });
    }
  }

  private addSkillField(container: Quark, value: string, index: number) {
    console.log('Adding skill field with value:', value, 'at index:', index);
    $(container, 'div', 'skill-field-container', {}, (q) => {
      const skillField = new FormTextField({
        label: `Skill ${index + 1}`,
        placeholder: 'Your skill',
        value: value,
      });
      
      console.log('Skill field created with value:', value);

      $(q, 'div', 'skill-field-row', {}, (q) => {
        skillField.render(q);

        $(q, 'div', 'remove-skill-button', {}, (q) => {
          new IconButton({
            label: '',
            icon: 'fa fa-trash',
            onClick: () => {
              this.skillSetValues.splice(index, 1);
              this.updateSkillSetFields();
            },
          }).render(q);
        });
      });

      this.skillSetFields.push(skillField);
    });
  }

  private async saveChanges() {
    try {
      const user = await CACHE_STORE.getUser().get();

      console.log('Save changes clicked');

      // Format date properly for the backend
      let dobValue = this.dobField.getValue();
      console.log('Original DOB value:', dobValue);

      if (dobValue) {
        try {
          // Ensure date is in YYYY-MM-DD format
          const dateObj = new Date(dobValue);
          if (!isNaN(dateObj.getTime())) {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            dobValue = `${year}-${month}-${day}`;
            console.log('Formatted DOB value:', dobValue);
          } else {
            console.warn('Could not parse date:', dobValue);
          }
        } catch (e) {
          console.error('Error formatting date:', e);
        }
      }

      // Collect common field data
      const profileData: any = {
        email: this.emailField.getValue(),
        phone: this.phoneField.getValue(),
        firstName: this.firstNameField.getValue(),
        lastName: this.lastNameField.getValue(),
        dob: dobValue,
      };

      // Add role-specific data
      if (this.profile.role === 'Validator' || this.profile.role === 'ProjectLead') {
        profileData.skills = this.skillsField.getValue();
        profileData.experience = this.experienceField.getValue();
        profileData.cvLink = this.cvLinkField.getValue();
        profileData.reference = this.referenceField.getValue();
      } else if (this.profile.role === 'Client') {
        profileData.companyName = this.companyNameField.getValue();
      } else if (this.profile.role === 'Hacker') {
        // Update skillSet values from fields
        this.skillSetFields.forEach((field, index) => {
          this.skillSetValues[index] = field.getValue();
        });

        // Filter out empty skills
        profileData.skillSet = this.skillSetValues.filter((skill) => skill.trim() !== '');
      }

      console.log('Sending profile data:', JSON.stringify(profileData, null, 2));

      // Get required name from profile if not in fields
      profileData.name = this.profile.name; // Keep original name

      // Send update request with explicit debug options
      try {
        console.log(`Sending PUT request to /api/new-profile/${user.id}`);
        const response = await NETWORK.put(`/api/new-profile/${user.id}`, profileData, {
          handleError: true,
          throwError: true,
        });

        console.log('Profile update response:', response);

        // Reload profile and force UI update
        await this.loadProfile();
        // Force refresh of skill fields
        if (this.profile.role === 'Hacker') {
          this.skillSetValues = Array.isArray(this.profile.skillSet) ? this.profile.skillSet : [];
          this.updateSkillSetFields();
        }
        alert('Profile updated successfully!');
      } catch (networkError: any) {
        console.error('Network error details:', networkError);
        if (networkError.statusCode) {
          console.error(`Status code: ${networkError.statusCode}`);
        }
        if (networkError.message) {
          console.error(`Error message: ${networkError.message}`);
        }
        if (networkError.errorDescription) {
          console.error(`Error description: ${networkError.errorDescription}`);
        }
        if (networkError.servlet) {
          console.error(`Servlet: ${networkError.servlet}`);
        }
        if (networkError.data) {
          console.error(`Error data:`, networkError.data);
        }
        throw networkError;
      }
    } catch (error) {
      console.error('Error saving profile:', error);

      // Try to extract more details from the error
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      alert('Error saving profile: ' + error);
    }
  }

  public async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    // First load the profile data
    await this.loadProfile();

    // Then create the UI structure
    this.createUIStructure(q);
  }

  // Separate UI creation into its own method
  private createUIStructure(q: Quark): void {
    q.innerHTML = '';
    $(q, 'div', 'bg-primary container-lg mx-auto my-5', {}, (q) => {
      // Header row
      $(q, 'div', 'd-flex justify-content-between align-items-center mb-4', {}, (q) => {
        $(q, 'h1', 'heading-1 text-primary', {}, `Hello ${this.profile?.name || 'User'}!`);
        $(q, 'div', 'position-relative w-30', {}, (q) => {
          $(q, 'img', 'w-100 hp-100 rounded-3 bg-secondary position-absolute', {
            src: this.profile?.profilePicture || 'assets/avatar.png',
            alt: '',
          });
          $(q, 'div', 'position-absolute top-0 left-0 w-100 hp-100 d-flex justify-content-center align-items-center filter-brightness-70', {}, (q) => {
            new IconButton({
              label: '',
              icon: 'fa fa-camera',
              onClick: async () => {
                console.log('Change profile picture');
              },
            }).render(q);
          });
        });
      });

      // User role display
      if (this.profile?.role) {
        $(q, 'div', 'user-role', {}, (q) => {
          $(q, 'span', 'role-label', {}, 'Role: ');
          $(q, 'span', 'role-value', {}, this.profile.role);
        });
      }

      // Render collapsibles
      $(q, 'div', 'w-100 d-flex flex-column align-items-center', {}, (q) => {
        // User Info Section
        this.userInfoCollapsible.render(q);
        $(this.userInfoCollapsible.content!, 'div', 'user-info-content', {}, (q) => {
          $(q, 'div', 'profile-details', {}, (q) => {
            this.emailField.render(q);
            this.phoneField.render(q);
            this.firstNameField.render(q);
            this.lastNameField.render(q);
            this.dobField.render(q);
          });
        });

        // Role-specific section
        if (this.profile?.role) {
          this.roleSpecificCollapsible.render(q);
          $(this.roleSpecificCollapsible.content!, 'div', 'role-specific-content', {}, (q) => {
            if (this.profile.role === 'Validator' || this.profile.role === 'ProjectLead') {
              $(q, 'div', 'validator-project-lead-details', {}, (q) => {
                this.skillsField.render(q);
                this.experienceField.render(q);
                this.cvLinkField.render(q);
                this.referenceField.render(q);
              });
            } else if (this.profile.role === 'Client') {
              $(q, 'div', 'client-details', {}, (q) => {
                $(q, 'h3', '', {}, 'Client Information');
                this.companyNameField.render(q);
              });
            } else if (this.profile.role === 'Hacker') {
              console.log('Rendering hacker section with skills:', this.skillSetValues);
              $(q, 'div', 'hacker-details', {}, (q) => {
                $(q, 'h3', '', {}, 'Skills');
                $(q, 'div', 'skill-set-container', {}, (q) => {
                  this.skillSetContainer = q;
                  // Initialize skill fields with existing values
                  if (this.profile.skillSet) {
                    console.log('Skill set from profile:', this.profile.skillSet);
                    this.skillSetValues = Array.isArray(this.profile.skillSet) ? this.profile.skillSet : [];
                    console.log('Processed skill set values:', this.skillSetValues);
                    this.updateSkillSetFields();
                  }
                });
              });
            }
            this.updateFields();
            $(q, 'div', 'd-flex justify-content-end gap-2', {}, (q) => {
              new Button({
                label: 'Change Password',
                type: ButtonType.SECONDARY,
                onClick: () => router.navigateTo('/reset-password'),
              }).render(q);

              new Button({
                label: 'Save Changes',
                type: ButtonType.PRIMARY,
                onClick: () => this.saveChanges(),
              }).render(q);
            });
          });
        }

        // Save button
        $(q, 'div', 'save-button-container', {}, (q) => {
          new Button({
            label: 'Save Changes',
            type: ButtonType.PRIMARY,
            onClick: () => this.saveChanges(),
          }).render(q);
        });

        new Button({
          label: 'Logout',
          type: ButtonType.SECONDARY,
          onClick: () => {
            CACHE_STORE.getUser().signOut();
            router.navigateTo('/');
          },
        }).render(q);
      });
    });

    // Update other fields after UI structure is created
    this.updateFields();
  }
}

export const profileViewHandler = new ViewHandler('', ProfileView);
