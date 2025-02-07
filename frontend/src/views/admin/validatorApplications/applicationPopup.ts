import { QuarkFunction as $ } from '@ui_lib/quark';
import { CACHE_STORE } from '@data/cache';
import LoadingScreen from '@components/loadingScreen/loadingScreen';
import BasicInfoComponent from '@components/basicInfo/basicInfoComponent';
// import './InvitationPopup.scss';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import NETWORK from '@/data/network/network';

export class ApplicationPopup {
  private readonly requestId: string;
  private application: any;

  constructor(params: { requestId: string }) {
    this.requestId = params.requestId;
  }

  async loadData(): Promise<void> {
    try {
      const response = await NETWORK.get(`/api/admin/applicationData/${this.requestId}`, { showLoading: true });
      this.application = response.data;
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

    $(q, 'div', 'hacker-invitation', {}, (q) => {
      // $(q, 'h2', '', {}, `Application: ${this.application.title} #${convertToTitleCase(this.requestId)}`);
      $(q, 'div', 'content', {}, (q) => {
        $(q, 'h3', '', {}, 'Rules and Scope');
        $(q, 'ul', '', {}, (q) => {
          // this.projectInfo.scope.forEach((rule) => {
          //   $(q, 'li', '', {}, rule);
          // });
        });
        $(q, 'div', 'buttons', {}, (q) => {
          new IconButton({
            type: ButtonType.PRIMARY,
            icon: 'fa-solid fa-check',
            label: 'Accept Invitation',
            onClick: () => {
              console.log('Accept Application');
            },
          }).render(q);
          new IconButton({
            type: ButtonType.TERTIARY,
            icon: 'fa-solid fa-times',
            label: 'Reject Invitation',
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
