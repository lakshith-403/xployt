import { QuarkFunction as $ } from '@ui_lib/quark';
import { CACHE_STORE } from '@data/cache';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import BasicInfoComponent from '@components/basicInfo/basicInfoComponent';
// import './InvitationPopup.scss';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import NETWORK from '@/data/network/network';

export class ApplicationPopup {
  private readonly userId: string;
  private application: any;

  constructor(params: { userId: string }) {
    this.userId = params.userId;
  }

  async loadData(): Promise<void> {
    try {
      const response = await NETWORK.get(`/api/admin/applicationData/${this.userId}`, { showLoading: true });
      this.application = response.data.applicationData[0];
      console.log('application data: ', this.application);
    } catch (error) {
      console.error('Failed to load project data', error);
    }
  }

  async render(): Promise<HTMLElement> {
    const q = document.createElement('div');
    const loading = new LoadingScreen(q);
    loading.show();

    await this.loadData();
    loading.hide();

    $(q, 'div', 'hacker-application', {}, (q) => {
      $(q, 'div', 'content', {}, (q) => {
        $(q, 'div', 'heading', {}, (q) => {
          $(q, 'h3', '', {}, 'Applicant Details');
        });

        $(q, 'div', 'applicant-details', {}, (q) => {
          $(q, 'p', '', {}, `First Name: ${this.application.firstName}`);

          $(q, 'p', '', {}, `Last Name: ${this.application.lastName}`);
          $(q, 'p', '', {}, `Email: ${this.application.email}`);

          $(q, 'p', '', {}, `Mobile: ${this.application.phone}`);
          $(q, 'p', '', {}, `LinkedIn: ${this.application.linkedIn ? this.application.linkedIn : 'Not provided'}`);
          $(q, 'p', '', {}, `Date of Birth: ${this.application.dob}`);
        });

        $(q, 'ul', '', {}, (q) => {});
        $(q, 'div', 'buttons', {}, (q) => {
          new IconButton({
            type: ButtonType.PRIMARY,
            icon: 'fa-solid fa-check',
            label: 'Accept Application',
            onClick: () => {
              console.log('Accept Application');
            },
          }).render(q);
          new IconButton({
            type: ButtonType.TERTIARY,
            icon: 'fa-solid fa-times',
            label: 'Reject Application',
            onClick: () => {
              console.log('Reject Application');
            },
          }).render(q);
        });
      });
    });

    return q;
  }
}

function convertToTitleCase(input: string): string {
  const words = input.replace(/([A-Z])/g, ' $1').trim();
  return words.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}
