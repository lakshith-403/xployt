import { Quark, QuarkFunction as $ } from '@/ui_lib/quark';
import { View, ViewHandler } from '@/ui_lib/view';
import { IconButton } from '@/components/button/icon.button';
import { Button, ButtonType } from '@/components/button/base';
import { CollapsibleBase } from '@/components/Collapsible/collap.base';
import { CACHE_STORE } from '@/data/cache';
import NETWORK from '@/data/network/network';
import { router } from '@/ui_lib/router';
import { FormTextField } from '@/components/text_field/form.text_field';
import { FileInputBase } from '../components/input_file/input.file';
import { TagInput } from '@/components/text_field/tagInput/tagInput';

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
  private usernameField: FormTextField;

  // Role-specific fields
  // Validator/ProjectLead fields
  private skillsField: FormTextField;
  private experienceField: FormTextField;
  private cvLinkField: FormTextField;
  private referenceField: FormTextField;

  // Client fields
  private companyNameField: FormTextField;

  // Hacker fields
  private skillSetValues: string[] = [];
  private linkedInField: FormTextField;
  private certificateField: FileInputBase;
  private skillsInput: TagInput;

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
    this.usernameField = new FormTextField({ label: 'Username', placeholder: 'Enter your username', name: 'username' });

    // Client fields
    this.companyNameField = new FormTextField({ label: 'Company Name' });

    // Validator/ProjectLead fields
    this.skillsField = new FormTextField({ label: 'Skills' });
    this.experienceField = new FormTextField({ label: 'Experience' });
    this.cvLinkField = new FormTextField({ label: 'CV Link' });
    this.referenceField = new FormTextField({ label: 'References' });

    // Hacker fields
    this.linkedInField = new FormTextField({ label: 'LinkedIn Profile', placeholder: 'Enter your LinkedIn profile URL', name: 'linkedIn' });

    this.certificateField = new FileInputBase({
      label: 'Certificates',
      accept: '.pdf,.jpg,.jpeg,.png',
      multiple: true,
      name: 'certificates',
    });

    this.skillsInput = new TagInput({
      label: '',
      placeholder: 'Enter your skills',
      name: 'skills',
      suggestions: hackerSkillsTags,
      hideLabel: true,
      onChange: (tags: string[]) => {
        this.skillSetValues = [];
        this.skillSetValues.push(...tags);
      },
    });
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
        this.skillsInput.removeAllTags();
        this.skillsInput.addTags(this.profile.skillSet);
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
      this.usernameField.setValue(this.profile.username || '');
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
      } else if (this.profile.role === 'Hacker') {
        this.linkedInField.setValue(this.profile.linkedIn || '');
      }
    }
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
        username: this.usernameField.getValue(),
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
        // Filter out empty skills
        profileData.skillSet = this.skillsInput.getSelectedTags();
        profileData.linkedIn = this.linkedInField.getValue();
      }

      console.log('Sending profile data:', JSON.stringify(profileData, null, 2));

      // Get required name from profile if not in fields
      profileData.name = this.profile.name; // Keep original name

      // Create FormData for file upload
      const formData = new FormData();

      // Add profile data as a JSON string
      const profileJson = JSON.stringify(profileData);
      formData.append('profile', profileJson);

      // Add certificate files if they exist
      const certificateFiles = this.certificateField.getFiles();
      if (certificateFiles.length > 0) {
        certificateFiles.forEach((file: File, index: number) => {
          formData.append('certificates', file);
        });
      }

      // Send update request with explicit debug options
      try {
        console.log(`Sending PUT request to /api/new-profile/${user.id}`);
        console.log('FormData contents:', {
          profile: profileJson,
          files: certificateFiles.map((f) => f.name),
        });

        const response = await NETWORK.put(`/api/new-profile/${user.id}`, formData, {
          handleError: true,
          throwError: true,
          dataTransferType: 'multipart/form-data',
          showLoading: true,
        });

        console.log('Profile update response:', response);

        // Reload profile and force UI update
        await this.loadProfile();
        // Force refresh of skill fields
        if (this.profile.role === 'Hacker') {
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
            this.usernameField.render(q);
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
                // Add Blast Points display
                $(q, 'div', 'blast-points-container', {}, (q) => {
                  $(q, 'h3', '', {}, 'Blast Points');
                  $(q, 'div', 'blast-points-value', {}, (q) => {
                    const blastPoints = this.profile.blastPoints !== undefined ? this.profile.blastPoints : 0;
                    console.log('Displaying blast points:', blastPoints);
                    $(q, 'span', 'points', {}, blastPoints.toString());
                  });
                });

                $(q, 'h3', '', {}, 'Skills');
                $(q, 'div', 'skill-set-container', {}, (q) => {
                  this.skillsInput.render(q);
                });

                // Add LinkedIn field for hackers
                $(q, 'div', 'linkedin-field', {}, (q) => {
                  this.linkedInField.render(q);
                });

                // Add certificate upload field
                $(q, 'div', 'certificate-field', {}, (q) => {
                  this.certificateField.render(q);
                });
              });
            }
            this.updateFields();
          });
        }
        $(q, 'div', 'd-flex justify-content-end gap-2', {}, (q) => {
          new Button({
            label: 'Change Password',
            type: ButtonType.SECONDARY,
            onClick: () => router.navigateTo('/reset-password'),
          }).render(q);

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
    });

    // Update other fields after UI structure is created
    this.updateFields();
  }
}

export const hackerSkillsTags = [
  'Web Security',
  'Network Security',
  'API Testing',
  'Mobile Security',
  'Cloud Security',
  'OWASP Top 10',
  'Application Security',
  'Code Review',
  'DevSecOps',
  'IoT Security',
  'Hardware Testing',
  'Firmware Analysis',
  'Smart Contract Security',
  'Blockchain',
  'DeFi',
];

export const profileViewHandler = new ViewHandler('', ProfileView);
