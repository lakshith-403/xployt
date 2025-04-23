const platformAgreements = {
    clientOrganization: {
        title: "Client Organization Agreement",
        sections: [
            {
                title: "Purpose",
                content: [
                    "This agreement defines the responsibilities, expectations, and legal boundaries of the Client while using the services offered through the Xployt platform."
                ]
            },
            {
                title: "Understanding of Ethical Hacking",
                content: [
                    "Xployt facilitates ethical hacking and security testing for the purpose of identifying and mitigating vulnerabilities.",
                    "Hackers engaged through the platform operate within predefined scope and rules.",
                    "Ethical hacking carries inherent risks, including unintended disruptions or discovery of severe vulnerabilities."
                ]
            },
            {
                title: "Risk Acknowledgment",
                content: [
                    "While all participating hackers are bound by an agreement to act ethically and responsibly, Xployt cannot fully guarantee individual behavior.",
                    "Security testing may involve temporary system slowdowns, exposure of flaws, or other minor disruptions.",
                    "The responsibility to patch, secure, or respond to discovered vulnerabilities rests solely with the Client."
                ]
            },
            {
                title: "Legal Responsibilities",
                content: [
                    "In the event of a breach, misuse, or unethical behavior by a hacker:",
                    "- The Client agrees to pursue legal action directly against the individual(s) responsible",
                    "- Xployt will cooperate by providing logs, agreements, and relevant data to assist in legal proceedings",
                    "- The Client shall not hold Xployt, its employees, or its contractors liable for any damages resulting from unauthorized or malicious activity by hackers"
                ]
            },
            {
                title: "Non-Disparagement",
                content: [
                    "The Client agrees not to:",
                    "- Publicly blame, defame, or hold Xployt responsible for actions outside the platform's control",
                    "- Spread misinformation or take legal action against Xployt for damages caused by third-party actors (including hackers) beyond the agreed scope"
                ]
            },
            {
                title: "Confidentiality & Data Handling",
                content: [
                    "The Client agrees to:",
                    "- Share only the necessary systems and access relevant for testing",
                    "- Ensure sensitive data is protected, backed up, or anonymized as needed prior to testing",
                    "- Accept responsibility for any unintentional data exposure that occurs due to misconfigured or vulnerable systems"
                ]
            },
            {
                title: "Scope Definition",
                content: [
                    "- All engagements must have clearly defined scope and boundaries prior to testing",
                    "- The Client must not request or authorize actions that violate laws or ethical boundaries",
                    "- Unauthorized extension of scope by the Client may result in cancellation of services and/or account suspension"
                ]
            },
            {
                title: "Platform Rights",
                content: [
                    "Xployt reserves the right to:",
                    "- Suspend or terminate testing if malicious intent is suspected",
                    "- Intervene in disputes when necessary to uphold the ethical integrity of the platform",
                    "- Share anonymized statistics or success metrics for promotional or research purposes (no identifying information will be disclosed)"
                ]
            },
            {
                title: "Termination",
                content: [
                    "This agreement remains valid throughout the Client's usage of the platform. It may be terminated:",
                    "- By either party, with written notice",
                    "- Immediately by Xployt in case of violation of this agreement or misuse of the platform"
                ]
            }
        ],
        acceptanceClause: "By signing up for Xployt and participating in security testing, the Client confirms that:\n" +
            "- They have read, understood, and agreed to the terms of this agreement\n" +
            "- They accept the risks and responsibilities outlined\n" +
            "- They will uphold transparency, collaboration, and accountability throughout every engagement"
    },
    hackerParticipation: {
        title: "Hacker Participation Agreement",
        sections: [
            {
                title: "Purpose",
                content: [
                    "This agreement governs your participation in ethical hacking and vulnerability testing services facilitated through [Platform Name].",
                    "You agree to act in good faith to help client organizations identify and remediate security vulnerabilities."
                ]
            },
            {
                title: "Code of Conduct",
                content: [
                    "Act ethically and responsibly at all times",
                    "Respect the scope and terms of each project",
                    "Refrain from any unauthorized, malicious, or harmful activity",
                    "Disclose all findings exclusively through the platform's reporting tools",
                    "Follow timelines and communication protocols as assigned"
                ]
            },
            {
                title: "No Harm Clause",
                content: [
                    "You must not:",
                    "- Exploit vulnerabilities for personal gain",
                    "- Leak, sell, or share any findings with third parties",
                    "- Use client systems for phishing, spam, DDoS attacks, or data theft",
                    "- Access or tamper with client systems outside the authorized scope",
                    "Breaches of this clause will result in immediate suspension, legal action, and potential criminal reporting."
                ]
            },
            {
                title: "Full Disclosure Policy",
                content: [
                    "You agree to:",
                    "- Provide a complete, detailed, and accurate report of all vulnerabilities found",
                    "- Include proof-of-concept (PoC), reproduction steps, and potential impact",
                    "- Cooperate with platform validators for clarification or verification",
                    "Partial disclosures, withholding critical findings, or falsifying reports will result in disqualification and account termination."
                ]
            },
            {
                title: "Confidentiality",
                content: [
                    "You must treat all client data, systems, and communications as strictly confidential.",
                    "You agree to:",
                    "- Not disclose any information to unauthorized persons",
                    "- Only retain data temporarily for the purpose of preparing the report",
                    "- Permanently delete all local copies once your task is complete"
                ]
            },
            {
                title: "Intellectual Property",
                content: [
                    "All submitted findings, writeups, and reports become the property of the client organization upon submission and approval.",
                    "You retain the right to include anonymized findings in portfolios or research only with written permission from the platform and the client."
                ]
            },
            {
                title: "Legal Boundaries",
                content: [
                    "You acknowledge that:",
                    "- You are conducting authorized testing as an independent contractor",
                    "- You are not an employee or agent of the client",
                    "- Any malicious intent or non-compliance with this agreement may result in legal liability",
                    "This agreement is enforceable under the laws of Sri Lanka and any applicable international cybersecurity conventions."
                ]
            },
            {
                title: "Termination",
                content: [
                    "[Platform Name] reserves the right to:",
                    "- Suspend or terminate your account at any time for violations",
                    "- Withhold payment for incomplete, misleading, or unethical work",
                    "- Notify clients or authorities in case of breach or misconduct"
                ]
            }
        ],
        acceptanceClause: "By registering an account on [Platform Name], you confirm that:\n" +
            "- You have read, understood, and agree to this agreement\n" +
            "- You will uphold the integrity and security of every engagement\n" +
            "- You accept the consequences of any breach or deviation"
    },
    validatorApplication: {
        title: "Validator Application Agreement",
        sections: [
            {
                title: "Understanding the Role",
                content: [
                    "Validators are responsible for reviewing and approving security vulnerability reports submitted by ethical hackers.",
                    "The role requires a high degree of confidentiality, attention to detail, and adherence to legal and ethical standards.",
                    "Xployt holds the right to evaluate your application based on technical, ethical, and interpersonal criteria."
                ]
            },
            {
                title: "Ethical Standards",
                content: [
                    "Act with impartiality when reviewing reports, regardless of the hacker's identity or severity level.",
                    "Disclose conflicts of interest where applicable (e.g., validating reports for organizations you're affiliated with).",
                    "Avoid tampering, copying, leaking, or repurposing any sensitive report data you may access during trials or evaluations."
                ]
            },
            {
                title: "Confidentiality & Non-Disclosure",
                content: [
                    "Maintain confidentiality of all platform materials, interview content, and validator training content.",
                    "Not disclose any platform vulnerabilities, client data, or reports to external parties under any circumstances.",
                    "Immediately report any accidental exposure of sensitive information to platform administrators."
                ]
            },
            {
                title: "Legal & Compliance",
                content: [
                    "You confirm that:",
                    "- You are not currently under any investigation related to cybersecurity or data privacy",
                    "- You are not involved in any activity that conflicts with ethical hacking norms",
                    "- You will comply with all applicable laws and platform policies during the application process"
                ]
            },
            {
                title: "Application Process",
                content: [
                    "The selection process may include:",
                    "- Technical assessments of security knowledge",
                    "- Sample report evaluation exercises",
                    "- Background and reference checks",
                    "- Interviews with the Xployt team",
                    "All decisions regarding applicant selection are at Xployt's sole discretion."
                ]
            },
            {
                title: "No Employment Assumption",
                content: [
                    "This agreement does not guarantee employment or engagement as a Validator.",
                    "Successful completion of the interview process is required for final onboarding and contract signing.",
                    "Xployt reserves the right to terminate the application process at any stage without explanation."
                ]
            },
            {
                title: "Consent to Further Agreements",
                content: [
                    "If selected, you agree to:",
                    "- Sign a formal Validator Role Agreement defining access rights and responsibilities",
                    "- Complete all required training programs",
                    "- Undergo periodic performance reviews",
                    "- Maintain any required certifications"
                ]
            },
            {
                title: "Data Handling",
                content: [
                    "All application materials become property of Xployt.",
                    "You consent to Xployt storing and processing your application data for evaluation purposes.",
                    "Unsuccessful applicant data will be deleted within 90 days unless otherwise agreed."
                ]
            }
        ],
        acceptanceClause: "By submitting your application, you confirm that:\n" +
            "- You have read, understood, and agree to the above terms\n" +
            "- All information provided is accurate and complete\n" +
            "- You meet all stated requirements for this role\n" +
            "- You consent to the application process as described"
    },
};

export default platformAgreements;