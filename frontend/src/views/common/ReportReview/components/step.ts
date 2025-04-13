import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import {ReportAttachment, ReportSteps} from "@data/common/cache/vulnerabilityReport.cache";
import NETWORK from "@data/network/network";

export class ReportStepElement{
    private stepNumber: string;
    private description: string;
    private files: ReportAttachment[];

    constructor(step: ReportSteps) {
        this.stepNumber = step.stepNumber
        this.description = step.description;
        this.files = step.attachments;
    }

    private renderStepHeader(q: Quark): void {
        $(q, 'h3', 'step-number', {}, `Step ${String(this.stepNumber).padStart(2, '0')}`);
    }

    private renderStepDescription(q: Quark): void {
        $(q, 'span', 'report-element align-top', {}, (q) => {
            $(q, 'label', 'label', {}, "Description");
            $(q, 'p', 'input description', {}, this.description);
        });
    }

    private renderStepAttachments(q: Quark): void {
        $(q, 'span', 'report-element align-center', {}, (attachmentPane) => {
            $(attachmentPane, 'label', 'label', {}, "Attachments");
            this.files.forEach((attachment) => this.renderAttachmentTag(attachmentPane, attachment));
        });
    }

    private renderAttachmentTag(q: Quark, attachment: ReportAttachment): void {
        let elem = $(q, 'div', 'attachment-tag', {}, (q) => {
            $(q, 'span', 'icon', {}, (q) => {
                $(q, 'i', 'fa-solid fa-newspaper', {});
            });
            $(q, 'span', 'name', {}, attachment.name);
        });

        elem.addEventListener('click', () => {
            window.open(NETWORK.baseURL + '/uploads/' + attachment.url, '_blank');
        });
    }

    render(q: Quark): void {
        $(q, 'div', 'step', {}, (q) => {
            this.renderStepHeader(q);
            this.renderStepDescription(q);
            this.renderStepAttachments(q);
        });
    }
}