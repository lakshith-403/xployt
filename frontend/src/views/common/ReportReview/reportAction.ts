import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { IconButton } from '@components/button/icon.button';
import { ButtonType } from '@components/button/base';
import NETWORK from '@/data/network/network';
import ModalManager, { setContent } from '@/components/ModalManager/ModalManager';
import { PopupLite } from '@components/popup/popup-lite';
import { modalAlertOnlyOK } from '@/main';
import { TextAreaBase } from '@components/test_area/textArea.base';
import { VulnerabilityReportCache } from '@/data/common/cache/vulnerabilityReport.cache';
import { CACHE_STORE } from '@/data/cache';

export class ReportAction {
  private readonly reportId: string;
  private report: any;
  private data: any;
  private renderFunction: (q: Quark) => Promise<void>;
  private popup: PopupLite;
  private feedbackTextArea!: TextAreaBase;

  constructor(params: { reportId: string; renderFunction: (q: Quark) => Promise<void> }) {
    this.reportId = params.reportId;
    this.renderFunction = params.renderFunction;
    this.popup = new PopupLite({ contentClass: 'filter-brightness-130' });
  }

  public setData(data: any) {
    this.data = data;
  }

  public setRenderFunction(renderFunction: (q: Quark) => Promise<void>) {
    this.renderFunction = renderFunction;
  }

  async loadData(): Promise<void> {
    try {
      console.log('report data: ', this.report);
    } catch (error: any) {
      console.error('Failed to load report data', error);
      throw error;
    }
  }

  async render(parent: HTMLElement, actionType: string): Promise<void> {
    this.popup.render(parent, (q) => {
      $(q, 'span', 'sub-heading-2 font-bold d-block', {}, actionType);

      $(q, 'div', 'report-action-details d-flex flex-column m-2 gap-1', {}, (q) => {
        $(q, 'div', 'bg-tertiary rounded-1 p-1', {}, (q) => {
          $(q, 'span', 'text-default font-bold', {}, `Report Info`);
          $(q, 'p', 'pl-1', {}, `- Project ID: ${this.data.projectId}`);
          $(q, 'p', 'pl-1 mb-0', {}, `- Report ID: ${this.data.reportId}`);
        });
        $(q, 'div', 'bg-tertiary rounded-1 p-1', {}, (q) => {
          $(q, 'span', 'text-default d-block font-bold mb-1', {}, `Feedback`);
          this.feedbackTextArea = new TextAreaBase({
            placeholder: 'Enter your feedback',
          });
          this.feedbackTextArea.render(q);
        });
      });

      $(q, 'ul', '', {}, (q) => {});
      $(q, 'div', 'buttons d-flex flex-row gap-2', {}, (q) => {
        new IconButton({
          type: ButtonType.PRIMARY,
          icon: 'fa-solid fa-check',
          label: 'Submit',
          onClick: async () => {
            try {
              const updatedStatus = actionType === 'Accept Report' ? 'Validated' : actionType === 'Reject Report' ? 'Rejected' : 'More Info';

              // Check if status is "More Info" and feedback is empty
              if (updatedStatus === 'More Info' && !this.feedbackTextArea.getValue().trim()) {
                setContent(modalAlertOnlyOK, {
                  '.modal-title': 'Error',
                  '.modal-message': 'Please provide feedback when requesting more information.',
                });
                ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true);
                return;
              }
              const validatorId = (await CACHE_STORE.getUser().get()).id;
              await NETWORK.post(`/api/validator/reportAction`, {
                reportId: this.reportId,
                actionType: updatedStatus,
                feedback: this.feedbackTextArea.getValue(),
              });
              setContent(modalAlertOnlyOK, {
                '.modal-title': 'Success',
                '.modal-message': 'Report successfully updated',
              });
              ModalManager.show('alertOnlyOK', modalAlertOnlyOK, true).then(async () => {
                new VulnerabilityReportCache(this.reportId).invalidate_cache();
                NETWORK.invalidateCache(`/api/fetch-reports/Validator/${this.data.projectId}/${updatedStatus}/${validatorId}`);
                NETWORK.invalidateCache(`/api/fetch-reports/Validator/${this.data.projectId}/Pending/${validatorId}`);
                this.popup.close();
                this.renderFunction(q);
              });
            } catch (error: any) {
              console.error('Failed to accept report', error);
              this.popup.close();
              // this.renderFunction(q);
            }
          },
        }).render(q);
      });
    });
  }
}
