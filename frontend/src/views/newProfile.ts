import { Quark, QuarkFunction as $ } from '../ui_lib/quark';
import { View, ViewHandler } from '../ui_lib/view';
import { TextField } from '../components/text_field/base';
import { IconButton } from '../components/button/icon.button';
import { Button, ButtonType } from '../components/button/base';
import { CollapsibleBase } from '../components/Collapsible/collap.base';
import { CACHE_STORE } from '../data/cache';
import LoadingScreen from '../components/loadingScreen/loadingScreen';
import { UserProfile, UserProfileCache } from '@/data/user/cache/userProfile';
import { router } from '@/ui_lib/router';
import NETWORK from '@/data/network/network';

export class NewProfileView extends View {
  private userInfoCollapsible: CollapsibleBase;
  private fundsCollapsible: CollapsibleBase;
  private profile!: UserProfile;
  private nameField: TextField;
  private emailField: TextField;
  private phoneField: TextField;
  private userProfileCache!: UserProfileCache;
  private loading: LoadingScreen | null = null;
  private user: any;

  constructor() {
    super();
    this.userInfoCollapsible = new CollapsibleBase('User Info', 'user-info');
    this.fundsCollapsible = new CollapsibleBase('Funds', 'funds');
    this.nameField = new TextField({ label: 'Name' });
    this.emailField = new TextField({ label: 'Email', type: 'email' });
    this.phoneField = new TextField({ label: 'Phone Number', type: 'tel' });
  }

  private async loadProfile() {
    try {
      this.user = await CACHE_STORE.getUser().get();
      // this.userProfileCache = CACHE_STORE.getUserProfile(user.id);
      // this.profile = await this.userProfileCache.get(false, user.id);
      this.profile = (await NETWORK.get(`/api/profile/${this.user.id}`)).data;
      console.log('ProfileView: Loaded profile:', this.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Error loading profile:' + error);
    }
  }

  private updateFields() {
    if (this.profile) {
      console.log('ProfileView: Updating fields with profile:', this.profile);
      this.nameField.setValue(this.profile.name);
      this.emailField.setValue(this.profile.email);
      this.phoneField.setValue(this.profile.phoneNumber);
    }
  }

  private async saveChanges() {
    if (this.loading) this.loading.show();
    try {
      this.profile = await NETWORK.get(`/api/profile/${this.user.id}`);

      const profileData = {
        name: this.nameField.getValue(),
        email: this.emailField.getValue(),
        phoneNumber: this.phoneField.getValue(),
      };
      await NETWORK.put(`/api/profile/${this.user.id}`, profileData);
      NETWORK.invalidateCache(`/api/profile/${this.user.id}`);
      await this.loadProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      if (this.loading) this.loading.hide();
    }
  }

  public async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    this.loading = new LoadingScreen(q);
    this.loading.show();
    await this.loadProfile();
    q.innerHTML = '';
    if (this.loading) this.loading.hide();

    $(q, 'div', 'bg-primary container-lg mx-auto my-5', {}, (q) => {
      // Header row
      $(q, 'div', 'd-flex justify-content-between align-items-center mb-4', {}, (q) => {
        $(q, 'h1', 'heading-1 text-primary', {}, `Hello ${this.profile?.name || 'User'}!`);
        $(q, 'div', 'position-relative w-30', {}, (q) => {
          $(q, 'img', 'w-100 hp-100 rounded-3 bg-secondary position-absolute', {
            src: this.profile?.profilePicture || 'assets/avatar.png',
            alt: '',
          });
          $(q, 'div', 'position-absolute top-0 left-0 w-100 hp-100 d-flex justify-content-center align-items-center hover-bg-opacity-75', {}, (q) => {
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
      $(q, 'div', 'w-100 d-flex flex-column align-items-center justify-content-center', {}, (q) => {
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

export const newProfileViewHandler = new ViewHandler('', NewProfileView);
