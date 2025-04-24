import {View, ViewHandler} from "@ui_lib/view";
import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import platformAgreements from "./agreement.data";
import platformDetails from "@views/policies/platform.data";
import "./policy.scss";

interface LegalAgreement {
    title: string;
    sections: AgreementSection[];
    acceptanceClause: string;
}

interface AgreementSection {
    title: string;
    content: string[];
}

export class UserAgreementView extends View {
    private agreement: LegalAgreement;

    constructor(params: { agreementType: string }) {
        super();
        if (params.agreementType === "client") {
            this.agreement = platformAgreements.clientOrganization;
        } else if (params.agreementType === "hacker") {
            this.agreement = platformAgreements.hackerParticipation;
        } else {
            this.agreement = platformAgreements.validatorApplication;
        }
    }

    render(q: Quark): void {
        $(q, "div", "user-agreement", {}, (q) => {
            // Render header
            $(q, "div", "agreement-header", {}, (q) => {
                $(q, "h1", "agreement-title", {}, `${platformDetails.platformName} ${this.agreement.title}`);
                $(q, "p", "agreement-dates", {}, `Effective Date: ${platformDetails.effectiveDate}`);
                $(q, "p", "agreement-dates", {}, `Last Updated: ${platformDetails.lastUpdated}`);
            });

            // Render sections
            $(q, "div", "agreement-sections", {}, (q) => {
                this.agreement.sections.forEach((section) => {
                    $(q, "div", "agreement-section", {}, (q) => {
                        $(q, "h2", "section-title", {}, section.title);
                        $(q, "ul", "section-content", {}, (q) => {
                            section.content.forEach((item) => {
                                const isSubPoint = item.trim().startsWith("- ");
                                const content = isSubPoint ? item.trim().substring(2) : item;
                                $(q, "li", isSubPoint ? "content-item sub-point" : "content-item", {}, content);
                            });
                        });
                    });
                });
            });

            // Render acceptance clause
            if (this.agreement.acceptanceClause) {
                $(q, "div", "acceptance-clause", {}, (q) => {
                    $(q, "h2", "clause-title", {}, "Acceptance Clause");
                    $(q, "p", "clause-content", {}, this.agreement.acceptanceClause);
                });
            }

            // Render contact information
            if (platformDetails.contact) {
                $(q, "div", "agreement-contact", {}, (q) => {
                    $(q, "h2", "contact-title", {}, "Contact Information");
                    $(q, "p", "contact-email", {}, `Email: ${platformDetails.contact.email}`);
                    if (platformDetails.contact.phone) {
                        $(q, "p", "contact-phone", {}, `Phone: ${platformDetails.contact.phone}`);
                    }
                });
            }
        });
    }
}

export const userAgreementViewHandler = new ViewHandler(
    "user-agreement/{agreementType}",
    UserAgreementView
);