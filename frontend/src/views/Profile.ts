import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { View, ViewHandler } from '../ui_lib/view';
import { TextField } from '../components/text_field/base';
import { IconButton } from '../components/button/icon.button';
import { Button, ButtonType } from '../components/button/base';
import { CollapsibleBase } from '../components/Collapsible/collap.base';
import { CACHE_STORE } from '../data/cache';
import NETWORK from '@/data/network/network';
import { router } from '@/ui_lib/router';

export class ProfileView extends View {
  private userInfoCollapsible: CollapsibleBase;
  private roleSpecificCollapsible: CollapsibleBase;

  private profile!: any;
  // Common fields
  private emailField: TextField;
  private phoneField: TextField;
  private firstNameField: TextField;
  private lastNameField: TextField;
  private dobField: TextField;
  
  // Role-specific fields
  // Validator/ProjectLead fields
  private skillsField: TextField;
  private experienceField: TextField;
  private cvIDField: TextField;
  private referenceField: TextField;
  
  // Client fields
  private companyNameField: TextField;
  
  // Hacker fields
  private skillSetContainer: Quark | null = null;
  private skillSetFields: TextField[] = [];
  private skillSetValues: string[] = [];

  constructor() {
    super();
    this.userInfoCollapsible = new CollapsibleBase('User Info', 'user-info');
    this.roleSpecificCollapsible = new CollapsibleBase('Role-Specific Info', 'role-specific-info');
    
    // Common fields
    this.emailField = new TextField({ label: 'Email', type: 'email' });
    this.phoneField = new TextField({ label: 'Phone Number', type: 'tel' });
    this.firstNameField = new TextField({ label: 'First Name' });
    this.lastNameField = new TextField({ label: 'Last Name' });
    this.dobField = new TextField({ label: 'Date of Birth', type: 'date' });
    
    // Client fields
    this.companyNameField = new TextField({ label: 'Company Name' });
    
    // Validator/ProjectLead fields
    this.skillsField = new TextField({ label: 'Skills' });
    this.experienceField = new TextField({ label: 'Experience' });
    this.cvIDField = new TextField({ label: 'CV Link' });
    this.referenceField = new TextField({ label: 'References' });
  }

  private async loadProfile() {
    try {
      const user = await CACHE_STORE.getUser().get();
      const response = await NETWORK.get(`/api/new-profile/${user.id}`);
      this.profile = response.data.profile;

      console.log('ProfileView: Loaded profile:', this.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      // alert('Error loading profile:' + error);
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
        this.cvIDField.setValue(this.profile.cvId || '');
        this.referenceField.setValue(this.profile.reference || '');
      } else if (this.profile.role === 'Client') {
        this.companyNameField.setValue(this.profile.companyName || '');
      } else if (this.profile.role === 'Hacker') {
        // Make sure we have a valid skillSet array
        if (this.profile.skillSet) {
          // Ensure skillSet is always an array
          this.skillSetValues = Array.isArray(this.profile.skillSet) ? this.profile.skillSet : [];
          console.log('Setting skill set values:', this.skillSetValues);
          
          // Only update fields if we have a container
          if (this.skillSetContainer) {
            this.updateSkillSetFields();
          }
        } else {
          console.log('No skillSet property found in profile data for Hacker role');
          this.skillSetValues = [];
        }
      }
    }
  }
  
  private updateSkillSetFields() {
    if (this.skillSetContainer && this.profile.role === 'Hacker') {
      console.log('updateSkillSetFields called with values:', this.skillSetValues);
      
      // Clear container and fields
      this.skillSetContainer.innerHTML = '';
      this.skillSetFields = [];
      
      if (this.skillSetValues && this.skillSetValues.length > 0) {
        // Create fields for existing skills
        this.skillSetValues.forEach((skill, index) => {
          console.log(`Creating skill field ${index} with value: ${skill}`);
          this.addSkillField(this.skillSetContainer!, skill, index);
        });
      } else {
        console.log('No skills to display');
        // Add a message if no skills
        $(this.skillSetContainer, 'p', 'no-skills-text', {}, 'No skills added yet.');
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
    } else {
      console.log('Cannot update skill fields - container is null or not a Hacker profile');
    }
  }
  
  private addSkillField(container: Quark, value: string, index: number) {
    console.log(`Adding skill field to container for index ${index}, value: ${value}`);
    
    $(container, 'div', 'skill-field-container', {}, (q) => {
      const skillField = new TextField({ 
        label: `Skill ${index + 1}`
      });
      skillField.setValue(value);
      
      $(q, 'div', 'skill-field-row', {}, (q) => {
        skillField.render(q);
        
        $(q, 'div', 'remove-skill-button', {}, (q) => {
          new IconButton({
            label: '',
            icon: 'fa fa-trash',
            onClick: () => {
              console.log(`Removing skill at index ${index}`);
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
        dob: dobValue
      };
      
      // Add role-specific data
      if (this.profile.role === 'Validator' || this.profile.role === 'ProjectLead') {
        profileData.skills = this.skillsField.getValue();
        profileData.experience = this.experienceField.getValue();
        profileData.cvId = this.cvIDField.getValue();
        profileData.reference = this.referenceField.getValue();
      } else if (this.profile.role === 'Client') {
        profileData.companyName = this.companyNameField.getValue();
      } else if (this.profile.role === 'Hacker') {
        // Update skillSet values from fields
        this.skillSetFields.forEach((field, index) => {
          this.skillSetValues[index] = field.getValue();
        });
        
        // Filter out empty skills
        profileData.skillSet = this.skillSetValues.filter(skill => skill.trim() !== '');
      }
      
      console.log('Sending profile data:', JSON.stringify(profileData, null, 2));
      
      // Get required name from profile if not in fields
      profileData.name = this.profile.name;  // Keep original name
      
      // Send update request with explicit debug options
      try {
        console.log(`Sending PUT request to /api/new-profile/${user.id}`);
        const response = await NETWORK.put(`/api/new-profile/${user.id}`, profileData, {
          handleError: true,
          throwError: true
        });
        
        console.log('Profile update response:', response);
        
        // Reload profile after update
        await this.loadProfile();
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
    
    try {
      await this.loadProfile();
      
      if (!this.profile) {
        console.error('Profile not loaded');
        $(q, 'div', 'error-message', {}, 'Error loading profile. Please try again later.');
        return;
      }
      
      console.log('Rendering profile with data:', this.profile);
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
                  this.cvIDField.render(q);
                  this.referenceField.render(q);
                });
              } else if (this.profile.role === 'Client') {
                $(q, 'div', 'client-details', {}, (q) => {
                  $(q, 'h3', '', {}, 'Client Information');
                  this.companyNameField.render(q);
                });
              } else if (this.profile.role === 'Hacker') {
                console.log('Rendering hacker section with skillSet:', this.profile.skillSet);
                $(q, 'div', 'hacker-details', {}, (q) => {
                  $(q, 'h3', '', {}, 'Skills');
                  $(q, 'div', 'skill-set-container', {}, (q) => {
                    this.skillSetContainer = q;
                    // Initialize skill values before updating fields
                    this.skillSetValues = Array.isArray(this.profile.skillSet) ? this.profile.skillSet : [];
                    console.log('Initializing skill set container with values:', this.skillSetValues);
                    this.updateSkillSetFields();
                  });
                });
              }
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
      
      this.updateFields();
    } catch (error) {
      console.error('Error rendering profile:', error);
      $(q, 'div', 'error-message', {}, 'Error rendering profile. Please try again later.');
    }
  }
}

export const profileViewHandler = new ViewHandler('', ProfileView);
