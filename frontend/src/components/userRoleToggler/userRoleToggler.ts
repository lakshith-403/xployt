import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './userRoleToggler.scss';
import { CACHE_STORE } from '@/data/cache';
import { UserCache } from '@/data/user';
import { UserType } from '@/data/user';

export class UserRoleToggler {
  private userTypes = ['Client', 'Validator', 'Lead', 'Hacker'];
  private userCache!: UserCache;
  // private container: Quark;
  private dropdown!: Quark;
  constructor() {
    this.userCache = CACHE_STORE.getUser();
    const body = document.body;
    $(body, 'div', 'roleChanger floating-button', {}, (q) => {
      $(q, 'button', '', { id: 'changeUserTypeButton' }, '@').addEventListener('click', () => this.toggleDropdown());

      this.dropdown = $(q, 'select', 'hidden', { id: 'userTypeDropdown' });
      this.userTypes.forEach((type) => {
        const option = $(this.dropdown, 'option', '', { value: type }, type);
        if (type === process.env.ROLE) {
          option.setAttribute('selected', 'selected'); // Explicitly set the 'selected' attribute
        }
      });

      this.dropdown.addEventListener('change', () => this.changeUserType(this.dropdown as HTMLSelectElement));
    });
    this.userCache.get().then((user) => {
      console.log(user);
    });
  }

  private toggleDropdown() {
    console.log('toggleDropdown');
    if (this.dropdown.classList.contains('hidden')) {
      this.dropdown.classList.remove('hidden');
      this.dropdown.click();
    } else {
      this.dropdown.classList.add('hidden');
    }
  }

  private changeUserType(dropdown: HTMLSelectElement) {
    const selectedUserType = dropdown.value;
    this.userCache.get().then((user) => {
      user.type = selectedUserType as UserType;
      this.userCache.get(true).then((user) => {
        console.log(user);
      });
      // this.updateUserType(selectedUserType);
      console.log(`User type updated to: ${selectedUserType}`);
      document.dispatchEvent(new CustomEvent('roleChanged', { detail: { newRole: selectedUserType } }));
      this.toggleDropdown();
    });
    // alert(`User type changed to ${selectedUserType}`);
  }

  // private updateUserType(newType: string) {
  //   // Implement the logic to update the user type
  // }
}
