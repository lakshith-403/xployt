import { Quark, QuarkFunction as $ } from "@ui_lib/quark";
import { formObject } from "@views/hacker/VulnerabilityReport/VulnerabilityReportForm";
import { ReportElement } from "@views/common/ReportReview/components/ReportElement";

export class ReportDetails {
    private formData: formObject;

    constructor(formData: formObject) {
        this.formData = formData;
    }

    render(q: Quark): void {
        $(q, 'h2', 'section-subtitle', {}, "Report Details");
        (Object.keys(this.formData) as Array<keyof formObject>).forEach((key) => {
            if (key !== 'steps' && key !== 'agreement') {
                new ReportElement(key.charAt(0).toUpperCase() + key.slice(1), this.formData[key].toString()).render(q);
            }
        });
    }
}