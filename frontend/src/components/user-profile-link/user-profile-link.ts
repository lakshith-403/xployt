import { Quark, QuarkFunction as $ } from '../../ui_lib/quark';
import { router } from '@/ui_lib/router';
import './user-profile-link.scss';

export interface UserProfileLinkProps {
  userId: string;
  userName: string;
  includeAvatar?: boolean;
  avatarUrl?: string;
  className?: string;
}

export class UserProfileLink {
  private props: UserProfileLinkProps;

  constructor(props: UserProfileLinkProps) {
    this.props = props;
  }

  public render(q: Quark): void {
    const { userId, userName, includeAvatar = false, avatarUrl, className = '' } = this.props;

    $(
      q,
      'a',
      `user-profile-link ${className}`,
      {
        href: '#',
        onclick: (e: Event) => {
          e.preventDefault();
          router.navigateTo(`/users/user/${userId}`);
        },
      },
      (q) => {
        if (includeAvatar) {
          $(q, 'img', 'user-avatar', {
            src: avatarUrl || 'assets/avatar.png',
            alt: `${userName}'s avatar`,
          });
        }

        $(q, 'span', 'user-name', {}, userName);
      }
    );
  }
}
