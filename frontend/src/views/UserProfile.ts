import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { View, ViewHandler } from '../ui_lib/view';
import './UserProfile.scss';
import { CACHE_STORE } from '../data/cache';
import LoadingScreen from '../components/loadingScreen/loadingScreen';
import { UserProfile, UserProfileCache } from '@/data/user/cache/userProfile';

export class UserProfileView extends View {
  private userId: string = '';
  private profile!: UserProfile;
  private userProfileCache!: UserProfileCache;
  private loading: LoadingScreen | null = null;

  constructor(params?: any) {
    super(params);
    if (params && params.userId) {
      this.userId = params.userId;
    }
  }

  private async loadProfile() {
    try {
      this.userProfileCache = CACHE_STORE.getUserProfile(this.userId);
      this.profile = await this.userProfileCache.get(false, this.userId);
      console.log('UserProfileView: Loaded profile:', this.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Error loading profile:' + error);
    }
  }

  public async render(q: Quark): Promise<void> {
    q.innerHTML = ''; // Clear existing content

    if (!this.userId) {
      q.innerHTML = '<div class="error-message">No user ID provided</div>';
      return;
    }

    this.loading = new LoadingScreen(q);
    this.loading.show();

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

      // User Info Section
      $(q, 'div', 'user-info-section', {}, (q) => {
        $(q, 'h2', 'section-title', {}, 'User Information');
        $(q, 'div', 'profile-details', {}, (q) => {
          $(q, 'div', 'profile-field', {}, (q) => {
            $(q, 'span', 'field-label', {}, 'Name:');
            $(q, 'span', 'field-value', {}, this.profile.name);
          });

          $(q, 'div', 'profile-field', {}, (q) => {
            $(q, 'span', 'field-label', {}, 'Email:');
            $(q, 'span', 'field-value', {}, this.profile.email);
          });

          $(q, 'div', 'profile-field', {}, (q) => {
            $(q, 'span', 'field-label', {}, 'Phone:');
            $(q, 'span', 'field-value', {}, this.profile.phoneNumber);
          });
        });
      });
    });
  }
}

export const userProfileViewHandler = new ViewHandler('/user/{userId}', UserProfileView);
