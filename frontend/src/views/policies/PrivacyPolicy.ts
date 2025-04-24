import {View, ViewHandler} from "@ui_lib/view";
import {Quark, QuarkFunction as $} from "@ui_lib/quark";
import privacyPolicies from "./policy.data";
import './policy.scss'

interface PrivacyPolicy {
    effectiveDate: string;
    lastUpdated: string;
    platformName: string;
    sections: PolicySection[];
    contact: {
        email: string;
        phone?: string;
    };
}

interface PolicySection {
    title: string;
    content: string[];
}

export type {PrivacyPolicy, PolicySection};

export class PrivacyPolicyView extends View {
    private policy: PrivacyPolicy;

    constructor(params: { userType: string }) {
        super();
        if (params.userType == "client") {
            this.policy = privacyPolicies.clientOrganizationPolicy;
        } else if (params.userType == "hacker") {
            this.policy = privacyPolicies.hackerPolicy;
        } else if (params.userType == "validator" || params.userType == "admin" || params.userType == "projectlead") {
            this.policy = privacyPolicies.internalStaffPolicy;
        } else {
            this.policy = privacyPolicies.guestPrivacyPolicy;
        }

    }

    render(q: Quark): void {
        $(q, "div", "privacy-policy", {}, (q) => {
            // Render header
            $(q, "div", "policy-header", {}, (q) => {
                $(q, "h1", "policy-title", {}, `${this.policy.platformName} Privacy Policy`);
                $(q, "p", "policy-dates", {}, `Effective Date: ${this.policy.effectiveDate}`);
                $(q, "p", "policy-dates", {}, `Last Updated: ${this.policy.lastUpdated}`);
            });

            // Render sections
            $(q, "div", "policy-sections", {}, (q) => {
                this.policy.sections.forEach((section) => {
                    $(q, "div", "policy-section", {}, (q) => {
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

            // Render contact information
            $(q, "div", "policy-contact", {}, (q) => {
                $(q, "h2", "contact-title", {}, "Contact Information");
                $(q, "p", "contact-email", {}, `Email: ${this.policy.contact.email}`);
                if (this.policy.contact.phone) {
                    $(q, "p", "contact-phone", {}, `Phone: ${this.policy.contact.phone}`);
                }
            });
        });
    }
}

export const privacyPolicyViewHandler = new ViewHandler(
    'privacy-policy/{userType}',
    PrivacyPolicyView
);