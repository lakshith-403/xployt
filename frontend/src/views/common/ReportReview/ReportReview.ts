import {View, ViewHandler} from "@ui_lib/view";
import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import {formObject} from "@views/hacker/VulnerabilityReport/VulnerabilityReportForm";
import {ReportHeader} from "./components/ReportHeader";
import {ReportDetails} from "./components/ReportDetails";
import {ReportProofOfConcept as ProofOfConcept} from "./components/ProofOfConcept";

export class ReportReview extends View {
    private reportId: string;
    private projectId: string;
    private formData: formObject;

    constructor(params: { projectId: string; reportId: string }) {
        super();
        this.reportId = params.reportId;
        this.projectId = params.projectId;
        this.formData = {
            vulnerabilityType: 'test',
            severity: 'test',
            reportTitle: 'test',
            description: 'test',
            steps: [{
                description: 'test',
                attachments: 'test'
            }],
            agreement: false
        };
    }

    async render(q: Quark): Promise<void> {
        $(q, 'div', 'report-review', {}, async (q) => {
            $(q, 'h1', 'title', {}, `Vulnerability Report | Project #${this.projectId}`);
            await new ReportHeader(this.projectId).render(q);
            new ReportDetails(this.formData).render(q);
            new ProofOfConcept(this.formData.steps).render(q);
        });
    }
}

export const vulnReportReviewViewHandler = new ViewHandler(
    '/vulnerability/{projectId}/{reportId}',
    ReportReview
);