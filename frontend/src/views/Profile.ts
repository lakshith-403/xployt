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
  // private userCache: UserCacheMock;
  // private fundsCollapsible: CollapsibleBase;

  private profile!: any;
  private nameField: TextField;
  private emailField: TextField;
  private phoneField: TextField;
  // private userProfileCache!: UserProfileCache;
  // private loading: LoadingScreen | null = null;

  constructor() {
    super();
    this.userInfoCollapsible = new CollapsibleBase('User Info', 'user-info');
    // this.fundsCollapsible = new CollapsibleBase('Funds', 'funds');
    this.nameField = new TextField({ label: 'Name' });
    this.emailField = new TextField({ label: 'Email', type: 'email' });
    this.phoneField = new TextField({ label: 'Phone Number', type: 'tel' });

    // Conditionslly initilaise Inputs
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
  private updateFields() {
    if (this.profile) {
      console.log('ProfileView: Updating fields with profile:', this.profile);
      console.log('ProfileView: Profile name:', this.profile.name);
      console.log('ProfileView: Profile email:', this.profile.email);
      console.log('ProfileView: Profile phone number:', this.profile.phone);
      this.nameField.setValue(this.profile.name);
      this.emailField.setValue(this.profile.email);
      this.phoneField.setValue(this.profile.phone);
    }
  }
  private async saveChanges() {
    try {
      const user = await CACHE_STORE.getUser().get();
      const userProfileCache = CACHE_STORE.getUserProfile(user.id);
      const profileData = {
        name: this.nameField.getValue(),
        email: this.emailField.getValue(),
        phoneNumber: this.phoneField.getValue(),
      };
      await userProfileCache.updateProfile(user.id, profileData);
      await this.loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }
  public async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    await this.loadProfile();
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

      // Render collapsibles
      $(q, 'div', 'w-100 d-flex flex-column align-items-center', {}, (q) => {
        // User Info Section
        this.userInfoCollapsible.render(q);
        $(this.userInfoCollapsible.content!, 'div', 'p-2', {}, (q) => {
          $(q, 'div', 'd-flex flex-column gap-3 mb-4', {}, (q) => {
            this.nameField.render(q);
            this.emailField.render(q);
            this.phoneField.render(q);
          });
          this.updateFields();
          $(q, 'div', 'd-flex justify-content-end', {}, (q) => {
            new Button({
              label: 'Save Changes',
              type: ButtonType.PRIMARY,
              onClick: () => this.saveChanges(),
            }).render(q);
          });
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
  }
}

export const profileViewHandler = new ViewHandler('', ProfileView);
