import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { View, ViewHandler } from '../ui_lib/view';
import './UserProfile.scss';
import LoadingScreen from '../components/loadingScreen/loadingScreen';
import NETWORK from '@/data/network/network';
import { CollapsibleBase } from '../components/Collapsible/collap.base';

export class UserProfileView extends View {
  private userId: string = '';
  private userProfile!: any;
  private profile!: any;
  private loading: LoadingScreen | null = null;
  private userInfoCollapsible: CollapsibleBase;

  constructor(params?: any) {
    console.log('UserProfileView: Constructor called with params:', params);
    super(params);
    if (params && params.userId) {
      this.userId = params.userId;
    }
    this.userInfoCollapsible = new CollapsibleBase('User Info', 'user-info');
  }

  private async loadProfile() {
    try {
      console.log('UserProfileView: Loading profile for user:', this.userId);
      this.userProfile = await NETWORK.get(`/api/fetch-profile/${this.userId}`);
      this.profile = this.userProfile.data.results[0];
      console.log('UserProfileView: Profile loaded:', this.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Error loading profile:' + error);
    }
  }

  public async render(q: Quark): Promise<void> {
    q.innerHTML = ''; // Clear existing content
    this.loading = new LoadingScreen(q);
    this.loading.show();

    if (!this.userId) {
      q.innerHTML = '<div class="error-message">No user ID provided</div>';
      return;
    }

    await this.loadProfile();
    q.innerHTML = '';
    if (this.loading) this.loading.hide();

    if (!this.profile) {
      q.innerHTML = '<div class="error-message">User profile not found</div>';
      return;
    }

    $(q, 'div', 'profile-view', {}, (q) => {
      // Header row
      $(q, 'div', 'profile-header', {}, (q) => {
        $(q, 'h1', '', {}, `${this.profile?.name || 'User'}'s Profile`);
        $(q, 'div', 'profile-picture-container', {}, (q) => {
          $(q, 'img', 'profile-picture', {
            src: this.profile?.profilePicture || 'assets/avatar.png',
            alt: '',
          });
        });
      });

      $(q, 'span', `role-status role-status-${this.profile.role.toLowerCase()} mx-2 my-1`, {}, (q) => {
        $(q, 'span', 'role-indicator', {});
        $(q, 'span', 'role-text', {}, this.profile.role);
      });

      $(q, 'div', 'd-flex flex-column gap-1', {}, (q) => {
        $(q, 'div', 'bg-secondary rounded-3 py-1 px-2', {}, (q) => {
          $(q, 'span', 'text-light-green', {}, 'User Info');
          $(q, 'div', 'py-1 px-2', {}, (q) => {
            const selectedFields1 = ['firstName', 'lastName', 'phone', 'email', 'dob'];
            selectedFields1.forEach((key) => {
              if (key in this.profile) {
                $(q, 'div', 'd-flex flex-row gap-1', {}, (q) => {
                  $(q, 'span', 'field-label', {}, this.formatFieldLabel(key));
                  $(
                    q,
                    'span',
                    'field-value',
                    {},
                    this.profile[key] === null || this.profile[key] === '' ? 'Data not available' : typeof this.profile[key] === 'number' ? this.profile[key].toString() : this.profile[key]
                  );
                });
              }
            });
          });
        });

        $(q, 'div', 'bg-secondary rounded-3 py-1 px-2', {}, (q) => {
          $(q, 'span', 'text-light-green', {}, 'Additional Info');
          $(q, 'div', 'py-1 px-2', {}, (q) => {
            let selectedFields2 = ['linkedIn'];

            // Add role-specific fields
            switch (this.profile?.role?.toLowerCase()) {
              case 'validator':
              case 'projectlead':
                selectedFields2 = [...selectedFields2, 'skills', 'experience', 'reference'];
                break;
              case 'hacker':
                selectedFields2 = [...selectedFields2, 'skills'];
                break;
              case 'client':
                selectedFields2 = [...selectedFields2, 'companyName'];
                break;
            }

            selectedFields2.forEach((key) => {
              if (key in this.profile) {
                $(q, 'div', 'd-flex flex-row gap-1', {}, (q) => {
                  $(q, 'span', 'field-label', {}, this.formatFieldLabel(key));
                  $(
                    q,
                    'span',
                    'field-value',
                    {},
                    (() => {
                      if (this.profile[key] === null || this.profile[key] === '') {
                        return 'Data not available';
                      }
                      if (typeof this.profile[key] === 'number') {
                        return this.profile[key].toString();
                      }
                      if (['linkedIn'].includes(key)) {
                        return $(q, 'a', 'text-light-green font-underline', { href: this.profile[key], target: '_blank' }, this.profile[key]);
                      }
                      return this.profile[key];
                    })()
                  );
                });
              }
            });
          });
        });
      });
    });
  }

  private formatFieldLabel(key: string): string {
    // Convert camelCase to Title Case with spaces

    if (key === 'dob') {
      return 'Date of Birth:';
    }

    if (key === 'linkedIn') {
      return 'LinkedIn:';
    }

    return (
      key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim() + ':'
    );
  }
}

export const userProfileViewHandler = new ViewHandler('user-info/{userId}', UserProfileView);

export const userProfileForAdminViewHandler = new ViewHandler('/user-info/{userId}', UserProfileView);
