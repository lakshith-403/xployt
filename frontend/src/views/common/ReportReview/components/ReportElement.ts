import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import '../ReportReview.scss'

export class ReportElement {
    private label: string;
    private value: string;

    constructor(label: string, value: string) {
        this.label = label;
        this.value = value;
    }

    render(q: Quark): void {
        $(q, 'span', 'report-element align-center', {}, (q) => {
            $(q, 'p', 'label', {}, this.label);
            $(q, 'p', `input`, {}, this.value);
        });
    }
}