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

      // Render collapsibles
      $(q, 'div', 'collapsibles-container', {}, (q) => {
        // User Info Section
        this.userInfoCollapsible.render(q);
        $(this.userInfoCollapsible.content!, 'div', 'user-info-content', {}, (q) => {
          $(q, 'div', 'profile-details', {}, (q) => {
            Object.entries(this.profile).forEach(([key, value]: [string, any]) => {
              if (key !== 'profilePicture') { // Skip profile picture as it's shown above
                $(q, 'div', 'profile-field', {}, (q) => {
                  $(q, 'div', 'field-container', {}, (q) => {
                    $(q, 'span', 'field-label', {}, this.formatFieldLabel(key));
                    $(q, 'span', 'field-value', {}, value === null ? 'Data not available' : value);
                  });
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
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim() + ':';
  }
}

export const userProfileViewHandler = new ViewHandler('user-info/{userId}', UserProfileView);
