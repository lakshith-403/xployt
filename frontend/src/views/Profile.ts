import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { View, ViewHandler } from '../ui_lib/view';
import { TextField } from '../components/text_field/base';
import { IconButton } from '../components/button/icon.button';
import { Button, ButtonType } from '../components/button/base';
import './Profile.scss';
import { CollapsibleBase } from '../components/Collapsible/collap.base';
import { CACHE_STORE } from '../data/cache';
import LoadingScreen from '../components/loadingScreen/loadingScreen';
import { UserProfile, UserProfileCache, UserProfileCacheMock } from '@/data/User/cache/userProfile';
// import { User, UserCacheMock } from '@/data/user';

export class ProfileView extends View {
  private userInfoCollapsible: CollapsibleBase;
  // private userCache: UserCacheMock;
  private fundsCollapsible: CollapsibleBase;
  private profile!: UserProfile;
  private nameField: TextField;
  private emailField: TextField;
  private phoneField: TextField;
  private userProfileCache!: UserProfileCache;
  private loading: LoadingScreen | null = null;
  constructor() {
    super();
    this.userInfoCollapsible = new CollapsibleBase('User Info', 'user-info');
    this.fundsCollapsible = new CollapsibleBase('Funds', 'funds');
    // this.userProfileCache = new UserProfileCacheMock();
    // this.userCache = CACHE_STORE.getUser();
    this.nameField = new TextField({ label: 'Name' });
    this.emailField = new TextField({ label: 'Email', type: 'email' });
    this.phoneField = new TextField({ label: 'Phone Number', type: 'tel' });
  }
  private async loadProfile() {
    try {
      //  const userId = '101'; // Get actual user ID from your auth system
      // const user = await this.userCache.get();
      const userId = '101';
      this.userProfileCache = CACHE_STORE.getUserProfile(userId);
      this.profile = await this.userProfileCache.get(false, userId);
      console.log('ProfileView: Loaded profile:', this.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Error loading profile:' + error);
    }
  }
  private updateFields() {
    if (this.profile) {
      console.log('ProfileView: Updating fields with profile:', this.profile);
      console.log('ProfileView: Profile name:', this.profile.name);
      console.log('ProfileView: Profile email:', this.profile.email);
      console.log('ProfileView: Profile phone number:', this.profile.phoneNumber);
      this.nameField.setValue(this.profile.name);
      this.emailField.setValue(this.profile.email);
      this.phoneField.setValue(this.profile.phoneNumber);
    }
  }
  // private async saveChanges() {
  //   if (this.loading) this.loading.show();

  //   try {
  //     const userId = '123'; // Get actual user ID
  //     const userProfileCache = CACHE_STORE.getUserProfile(userId);
  //     const profileData = {
  //       name: this.nameField.getValue(),
  //       email: this.emailField.getValue(),
  //       phoneNumber: this.phoneField.getValue(),
  //     };

  //     await userProfileCache.updateProfile(userId, profileData);
  //     await this.loadProfile();
  //   } catch (error) {
  //     console.error('Error saving profile:', error);
  //   } finally {
  //     if (this.loading) this.loading.hide();
  //   }
  // }
  public async render(q: Quark): Promise<void> {
    q.innerHTML = ''; // Clear existing content
    this.loading = new LoadingScreen(q);
    this.loading.show();

    await this.loadProfile();
    q.innerHTML = '';
    if (this.loading) this.loading.hide();

    $(q, 'div', 'profile-view', {}, (q) => {
      // Header row
      $(q, 'div', 'profile-header', {}, (q) => {
        $(q, 'h1', '', {}, `Hello ${this.profile?.name || 'User'}!`);
        $(q, 'div', 'profile-picture-container', {}, (q) => {
          $(q, 'img', 'profile-picture', {
            src: this.profile?.profilePicture || 'https://picsum.photos/id/237/200/300',
            alt: '',
          });

          $(q, 'div', 'profile-picture-button-container', {}, (q) => {
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
      // Render collapsibles
      $(q, 'div', 'collapsibles-container', {}, (q) => {
        // User Info Section
        this.userInfoCollapsible.render(q);
        $(this.userInfoCollapsible.content!, 'div', 'user-info-content', {}, (q) => {
          $(q, 'div', 'profile-details', {}, (q) => {
            this.nameField.render(q);
            this.emailField.render(q);
            this.phoneField.render(q);
          });
          this.updateFields();

          // $(q, 'div', 'save-button-container', {}, (q) => {
          //   new Button({
          //     label: 'Save Changes',
          //     type: ButtonType.PRIMARY,
          //     onClick: () => this.saveChanges(),
          //   }).render(q);
          // });
        });
        // Funds Section
        // this.fundsCollapsible.render(q);
        // $(this.fundsCollapsible.content!, 'div', 'funds-content', {}, (q) => {
        //   $(q, 'div', 'funds-details', {}, (q) => {
        //     $(q, 'div', 'fund-box', {}, (q) => {
        //       $(q, 'h2', 'title', {}, 'Amount Remaining');
        //       $(q, 'p', 'amount', {}, `$${this.profile?.fundsRemaining || '0'}`);
        //     });
        //     $(q, 'div', 'fund-box', {}, (q) => {
        //       $(q, 'h2', 'title', {}, 'Amount Spent');
        //       $(q, 'p', 'amount', {}, `$${this.profile?.fundsSpent || '0'}`);
        //     });
        //     $(q, 'div', 'fund-box button-container', {}, (q) => {
        //       new Button({
        //         label: 'Add Funds',
        //         type: ButtonType.PRIMARY,
        //         onClick: () => console.log('Add funds'),
        //       }).render(q);
        //       new Button({
        //         label: 'View Transactions',
        //         type: ButtonType.SECONDARY,
        //         onClick: () => console.log('View transactions'),
        //       }).render(q);
        //     });
        //   });
        // });
      });
    });
  }
}

export const profileViewHandler = new ViewHandler('', ProfileView);
