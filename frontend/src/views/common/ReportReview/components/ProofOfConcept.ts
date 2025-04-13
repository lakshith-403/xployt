import { Quark, QuarkFunction as $ } from "@ui_lib/quark";
import { ReportStepElement } from "@views/common/ReportReview/components/step";

export class ReportProofOfConcept {
    private steps: { description: string; attachments: string[] }[];

    constructor(steps: { description: string; attachments: string[] }[]) {
        this.steps = steps;
    }

    render(q: Quark): void {
        $(q, 'h2', 'section-subtitle', {}, "Proof of Concept");
        this.steps.forEach((step, index) => {
            new ReportStepElement(index + 1, step).render(q);
        });
    }
}