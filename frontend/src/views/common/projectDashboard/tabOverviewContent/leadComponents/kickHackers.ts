import { Quark, QuarkFunction as $ } from '@ui_lib/quark';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import NETWORK from '@/data/network/network';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertForErrors, modalAlertOnlyOK } from '@/main';
import { PopupLite } from '@components/popup/popup-lite';
import { PublicUser } from '@data/user';

export class KickHackers {
  private readonly projectId: string;
  private popup: PopupLite;
  private hackerInfo: any[];

  constructor(params: { projectId: string }) {
    this.projectId = params.projectId;
    this.hackerInfo = [];
    this.popup = new PopupLite();
  }

  async loadData() {
    const response = await NETWORK.get(`/api/lead/manageHacker/${this.projectId}`, {
      localLoading: true,
      elementId: 'hacker-list',
    });
    this.hackerInfo = response.data.hackers;
    console.log('hackerInfo', this.hackerInfo);
  }

  async render(parent: HTMLElement): Promise<void> {
    await this.loadData();
    this.popup.render(parent, (q) => {
      $(q, 'div', 'sub-heading-2', {}, (q) => {
        $(q, 'h3', '', {}, 'Deactivate Hackers');
      });

      $(q, 'div', 'body', {}, (q) => {
        $(q, 'span', 'sub-heading-2', {}, `Select hackers to deactivate from project #${this.projectId}`);

        // Create a container for hacker list
        $(q, 'div', 'hacker-list mt-3', {}, (q) => {
          if (this.hackerInfo.length === 0) {
            $(q, 'div', 'no-hackers', {}, 'No hackers assigned to this project');
            return;
          }

          this.hackerInfo.forEach((hacker, index) => {
            $(q, 'div', 'hacker-item d-flex justify-content-between align-items-center p-2 border-bottom-1', {}, (q) => {
              // Hacker details
              $(q, 'div', 'hacker-details', {}, (q) => {
                $(q, 'div', 'hacker-name', {}, hacker.name || 'Unnamed Hacker');
                $(q, 'div', 'hacker-email text-muted', {}, hacker.email || 'No email provided');
              });

              // Remove button for this hacker
              const removeButton = new IconButton({
                type: hacker.status === 'Kicked' ? ButtonType.TERTIARY : ButtonType.SECONDARY,
                icon: hacker.status === 'Kicked' ? 'fa-solid fa-user-slash' : 'fa-solid fa-user-minus',
                label: hacker.status === 'Kicked' ? ' Deactivated' : ' Deactivate',
                className: `w-9-rm p-1 ${hacker.status === 'Kicked' ? 'cursor-not-allowed disabled' : ''}`,
                onClick: async () => {
                  if (hacker.status !== 'Kicked') {
                    await this.deactivateHacker(hacker);
                  }
                },
              }).render(q);
            });
          });
        });
      });

      $(q, 'div', 'buttons d-flex justify-content-center gap-2 mt-3', {}, (q) => {
        new IconButton({
          type: ButtonType.PRIMARY,
          icon: 'fa-solid fa-xmark',
          label: 'Close',
          onClick: async () => {
            this.popup.close();
          },
        }).render(q);
      });
    });
  }

  private async deactivateHacker(hacker: any): Promise<void> {
    try {
      await NETWORK.delete(`/api/lead/manageHacker/${this.projectId}/${hacker.hackerId}`, {
        localLoading: true,
        elementId: 'hacker-list',
        successCallback: () => {
          this.popup.close();
          NETWORK.invalidateCache(`/api/lead/manageHacker/${this.projectId}`);
          setContent(modalAlertOnlyOK, {
            '.modal-title': 'Success',
            '.modal-message': 'Hacker deactivated successfully for project #' + this.projectId,
          });

          ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(() => {
            this.popup.close();
          });
        },
      });

      console.log('Removed hacker from project: ', this.projectId);
    } catch (error: any) {
      this.popup.close();
      console.error('Error removing hacker from project: ', error);
    }
  }
}
