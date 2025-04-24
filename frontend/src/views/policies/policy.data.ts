import platformDetails from "@views/policies/platform.data";

const privacyPolicies = {
    clientOrganizationPolicy: {
        effectiveDate: platformDetails.effectiveDate,
        lastUpdated: platformDetails.lastUpdated,
        platformName: platformDetails.platformName,
        sections: [
            {
                title: "Information We Collect",
                content: [
                    "Organization name and point-of-contact details",
                    "Project-related data including system information, vulnerability scope, and authorization records",
                    "Communication records with our team and registered ethical hackers",
                    "Audit logs, platform usage data, and feedback"
                ]
            },
            {
                title: "Why We Collect This Data",
                content: [
                    "Match you with qualified ethical hackers",
                    "Manage the vulnerability reporting process",
                    "Ensure platform security and accountability",
                    "Provide support and maintain service quality",
                    "Comply with legal and cybersecurity obligations"
                ]
            },
            {
                title: "Data Sharing",
                content: [
                    "Verified ethical hackers, solely for engagement in authorized projects",
                    "Internal staff, for operational and security purposes",
                    "Legal entities or regulators, if required by law",
                    "We do not sell or rent your data to third parties."
                ]
            },
            {
                title: "Data Retention",
                content: [
                    "Project data, vulnerability reports, and associated hacker identities are retained indefinitely to:",
                    "- Provide continued protection to your infrastructure",
                    "- Support forensic investigations or legal disputes",
                    "- Comply with security standards and risk assessments",
                    "If you terminate your engagement with us, essential records are archived securely and access is restricted."
                ]
            },
            {
                title: "Your Rights",
                content: [
                    "Request access to your data",
                    "Correct or update inaccurate data",
                    "Object to certain data uses (unless legally or contractually required)",
                    "Due to the nature of our services, we may retain data necessary to protect your systems and prevent unauthorized access — even if a participating hacker requests deletion."
                ]
            },
            {
                title: "Security Measures",
                content: [
                    "We apply industry-standard safeguards (encryption, access controls, monitoring) to protect sensitive data."
                ]
            }
        ],
        contact: platformDetails.contact
    },
    hackerPolicy: {
        effectiveDate: platformDetails.effectiveDate,
        lastUpdated: platformDetails.lastUpdated,
        platformName: platformDetails.platformName,
        sections: [
            {
                title: "What We Collect",
                content: [
                    "Your full name and contact information",
                    "Identity verification (e.g., student ID, national ID)",
                    "Account credentials",
                    "Participation records: submissions, timestamps, projects handled",
                    "Activity logs and platform behavior"
                ]
            },
            {
                title: "Why We Collect This Data",
                content: [
                    "Authenticate your identity and ensure platform integrity",
                    "Assign you to appropriate projects",
                    "Track contributions and generate project logs",
                    "Investigate platform misuse or unethical behavior",
                    "Comply with legal obligations and maintain security"
                ]
            },
            {
                title: "Data Retention and the Right to Erasure",
                content: [
                    "Under most privacy laws, including GDPR, you have the right to request erasure of your data.",
                    "However, due to the nature of our services — which include security-sensitive ethical hacking tasks — we retain certain data indefinitely, such as:",
                    "- Your participation in past reports",
                    "- Submitted vulnerabilities",
                    "- Your identity associated with each report",
                    "Why?",
                    "To protect client organizations and support investigations in case of unethical activity.",
                    "We will, however:",
                    "- Delete your account credentials upon request",
                    "- Anonymize unused or non-project-related data where possible"
                ]
            },
            {
                title: "Data Sharing",
                content: [
                    "Client organizations you work with",
                    "Internal administrators",
                    "Legal authorities in cases of suspected malicious activity",
                    "We do not sell your data."
                ]
            },
            {
                title: "Security",
                content: [
                    "We store your data securely, with strict access control. Only authorized personnel can access sensitive user records."
                ]
            },
            {
                title: "Your Rights",
                content: [
                    "Access and view the data we hold",
                    "Request correction of inaccurate information",
                    "Request deletion of account data (except data tied to past reports)"
                ]
            }
        ],
        contact: platformDetails.contact
    },
    internalStaffPolicy: {
        effectiveDate: platformDetails.effectiveDate,
        lastUpdated: platformDetails.lastUpdated,
        platformName: platformDetails.platformName,
        sections: [
            {
                title: "Scope",
                content: [
                    "Full-time and part-time employees",
                    "Freelance or contractual project leads",
                    "Report validators",
                    "Platform administrators and support staff"
                ]
            },
            {
                title: "What Data We Collect",
                content: [
                    "Identity & Contact Information: Full name, phone number, email address, identification documents",
                    "Employment Details: Role, responsibilities, contracts, project history",
                    "Platform Activity: Logs of actions taken (e.g., project assignments, validations, escalations)",
                    "Communication Records: Internal discussions, feedback, and platform interactions",
                    "Security Logs: Login timestamps, IP addresses, access history, device/browser info"
                ]
            },
            {
                title: "Why We Collect This Data",
                content: [
                    "Verify identity and manage user privileges",
                    "Assign tasks, track progress, and coordinate collaboration",
                    "Ensure platform accountability and prevent misuse",
                    "Investigate incidents and resolve disputes",
                    "Comply with legal, contractual, or security obligations"
                ]
            },
            {
                title: "Data Sharing",
                content: [
                    "With other internal staff to enable collaboration",
                    "With client organizations (e.g., for validator signatures or project lead contact)",
                    "With legal authorities if required under law or during investigations",
                    "We never sell or use your data for marketing purposes."
                ]
            },
            {
                title: "Data Retention",
                content: [
                    "We retain your data for the duration of your role on the platform and for a reasonable period afterward, even after termination or resignation, to:",
                    "- Maintain report integrity",
                    "- Allow for security audits or investigations",
                    "- Comply with employment or contractual obligations",
                    "Access to your data will be restricted once your active involvement ends."
                ]
            },
            {
                title: "Security Measures",
                content: [
                    "We use:",
                    "- Access controls and role-based permissions",
                    "- Secure infrastructure and encrypted storage",
                    "- Activity monitoring and breach detection",
                    "Each internal member is expected to:",
                    "- Follow company security policies",
                    "- Report breaches or suspicious activity promptly",
                    "- Use two-factor authentication and secure credentials"
                ]
            },
            {
                title: "Your Rights",
                content: [
                    "View and request corrections to your personal data",
                    "Request clarification on how your data is used",
                    "Request removal of specific non-essential data (unless restricted by ongoing legal, security, or audit needs)",
                    "Note: Certain actions (e.g., validation records or audit logs) are permanently associated with your account for transparency."
                ]
            },
            {
                title: "Confidentiality & Access",
                content: [
                    "All internal users are bound by:",
                    "- Non-disclosure agreements (NDAs)",
                    "- Internal security protocols",
                    "- Role-specific confidentiality expectations",
                    "Breach of data access or misuse of internal privileges will result in disciplinary actions, including termination and legal consequences."
                ]
            }
        ],
        contact: platformDetails.contact
    },
    guestPrivacyPolicy: {
        effectiveDate: platformDetails.effectiveDate,
        lastUpdated: platformDetails.lastUpdated,
        platformName: platformDetails.platformName,
        title: "Privacy Policy",
        appliesTo: "Users accessing Xployt without registering or logging in",
        sections: [
            {
                title: "What Information We Collect",
                content: [
                    "When you access our platform as a guest, we may automatically collect:",
                    "- Device information (browser type, operating system)",
                    "- IP address",
                    "- Browsing behavior within our platform (pages viewed, time spent, etc.)",
                    "- Referring website (if you arrived via an external link)",
                    "We do not collect personal identifiers such as name, email, or contact details unless voluntarily provided through contact forms or support inquiries."
                ]
            },
            {
                title: "Use of Cookies & Tracking Tools",
                content: [
                    "We use essential cookies and analytics tools (e.g., Google Analytics) to:",
                    "- Improve user experience",
                    "- Understand how visitors interact with our platform",
                    "- Maintain security and prevent misuse",
                    "You can manage or disable cookies through your browser settings, but doing so may limit platform functionality."
                ]
            },
            {
                title: "How We Use Guest Data",
                content: [
                    "Guest data is used strictly for:",
                    "- Analytics and performance optimization",
                    "- Security monitoring",
                    "- Enhancing platform content and navigation",
                    "We do not use guest data for advertising or sell it to third parties."
                ]
            },
            {
                title: "Data Retention",
                content: [
                    "We retain guest usage data for a limited period (e.g., 30–90 days), after which it is anonymized or deleted unless legally required otherwise."
                ]
            },
            {
                title: "Third-Party Services",
                content: [
                    "We may share anonymized data with trusted third-party services for analytics or hosting (e.g., cloud infrastructure providers), but we ensure all partners comply with industry-standard data protection measures."
                ]
            },
            {
                title: "No User Profiling",
                content: [
                    "We do not create behavioral profiles or attempt to re-identify guests unless you convert to a registered user or explicitly provide your details."
                ]
            },
            {
                title: "Your Rights",
                content: [
                    "Although you are not required to identify yourself as a guest, you still have the right to:",
                    "- Request details about data we may have collected",
                    "- Ask for deletion of identifiable info you may have submitted",
                    "Please contact us at [privacy@xployt.com] if you have any concerns."
                ]
            },
            {
                title: "Changes to This Policy",
                content: [
                    "We may update this Guest Privacy Policy from time to time. Changes will be posted here with an updated 'Effective Date'."
                ]
            }
        ],
        contact: {
            email: "privacy@xployt.com"
        },
        acceptanceClause: "By continuing to use Xployt as a guest, you agree to this Privacy Policy",
        uiOptions: {
            showCheckbox: true,
            mobileShortForm: [
                "We collect limited device/browsing data from guests",
                "Data used only for analytics and security",
                "No advertising or third-party sales",
                "Manage cookies via browser settings"
            ]
        }
    }
};

export default privacyPolicies;