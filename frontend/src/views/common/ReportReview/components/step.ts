import {Quark, QuarkFunction as $} from "@ui_lib/quark";

export class ReportStepElement{
    private stepNumber: number;
    private description: string;
    private files: string;

    constructor(stepNumber: number, step:{description: string, attachments: string}) {
        this.stepNumber = stepNumber;
        this.description = step.description;
        this.files = step.attachments;
    }

    render(q: Quark): void {
        $(q, 'div', 'step', {}, (q) => {
            $(q, 'h3', 'step-number', {}, `Step ${String(this.stepNumber).padStart(2, '0')}`);
                $(q, 'span', 'report-element align-top', {}, (q) => {
                    $(q, 'label', 'label', {}, "Description");
                        $(q, 'p', 'input description', {}, this.description);
                });
                $(q, 'span', 'report-element align-center', {}, (q) => {
                    $(q, 'label', 'label', {}, "Attachments");
                    $(q, 'p', 'input', {}, this.files);
                });
            });
    }
}