import { QuarkFunction as $ } from '@ui_lib/quark';
import BasicInfoComponent from '@components/basicInfo/basicInfoComponent';
import './InvitationPopup.scss';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import { Project } from '@data/common/cache/project.cache';
import { HackerInvitationsCache } from '@data/hacker/cache/hacker.invitations.cache';
import ModalManager, { setContent } from "@components/ModalManager/ModalManager";
import { modalAlertForErrors, modalAlertOnlyOK } from "@main";
import { OverviewPayments } from "@views/common/projectDashboard/tabOverviewContent/commonComponents/payments";

export class InvitationPopup {
  private projectInfo: Project;
  private hackerId: string;
  private invitationsCache: HackerInvitationsCache;
  private status: string;

  constructor(params: { projectInfo: Project; hackerId: string; status: string }) {
    this.projectInfo = params.projectInfo;
    this.hackerId = params.hackerId;
    this.invitationsCache = new HackerInvitationsCache(this.hackerId);
    this.status = params.status;
  }

  private async acceptInvitation(): Promise<void> {
    try {
      await this.invitationsCache.accept(this.projectInfo.projectId.toString(), this.hackerId, true);
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Success',
        '.modal-message': 'You have successfully accepted the invitation.',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      window.location.reload(); // Refresh the window
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      setContent(modalAlertForErrors, {
        '.modal-title': 'Error',
        '.modal-message': 'Failed to accept the invitation. Please try again.',
      });
      ModalManager.show('alertForErrors', modalAlertForErrors);
    }
  }

  private async rejectInvitation(): Promise<void> {
    try {
      await this.invitationsCache.accept(this.projectInfo.projectId.toString(), this.hackerId, false);
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Success',
        '.modal-message': 'You have successfully rejected the invitation.',
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      window.location.reload(); // Refresh the window
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      setContent(modalAlertForErrors, {
        '.modal-title': 'Error',
        '.modal-message': 'Failed to reject the invitation. Please try again.',
      });
      ModalManager.show('alertForErrors', modalAlertForErrors);
    }
  }

  async render(): Promise<HTMLElement> {
    if ([ 'Accepted', 'Declined' ].includes(this.status)) {
      return document.createElement('div');
    }

    const q = document.createElement('div');
    console.log('Project Info: Invitation Popup ', this.projectInfo);

    $(q, 'div', 'hacker-invitation', {}, (q) => {
      $(q, 'h2', '', {}, `Invitation: ${this.projectInfo.title} #${convertToTitleCase(this.projectInfo.projectId.toString())}`);
      $(q, 'div', 'content', {}, (q) => {
        $(q, 'div', '', {id: 'basic-info'}, (q) => {
          new BasicInfoComponent(this.projectInfo).render(q);
        });

        $(q, 'div', 'bottom-container', {}, (q) => {
          $(q, 'div', 'card-content', {}, (q) => {
            new OverviewPayments(this.projectInfo.projectId.toString(), 'Hacker', this.hackerId).render(q);
          });

          $(q, 'div', 'buttons', {}, (q) => {
            new IconButton({
              type: ButtonType.PRIMARY,
              icon: 'fa-solid fa-check',
              label: 'Accept Invitation',
              onClick: () => {
                this.acceptInvitation();
              },
            }).render(q);
            new IconButton({
              type: ButtonType.TERTIARY,
              icon: 'fa-solid fa-times',
              label: 'Reject Invitation',
              onClick: () => {
                this.rejectInvitation();
              },
            }).render(q);
          });
        })

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
