import { PublicUser } from '@/data/discussion/discussion';
import { Quark, QuarkFunction as $ } from '@/ui_lib/quark';

export class UserTag {
  private user: PublicUser;

  constructor(user: PublicUser) {
    this.user = user;
  }

  render(q: Quark): void {
    $(q, 'span', 'user-row', {}, (q) => {
      $(q, 'span', '', {}, (q) => {
        $(q, 'div', '', { src: 'assets/avatar.png' });
        $(q, 'span', '', {}, this.user.name);
      });
      $(q, 'span', 'type', {}, this.user.role);
    });
  }
}
