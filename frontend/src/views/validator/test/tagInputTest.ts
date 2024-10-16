import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { TagInput } from '@components/text_field/tagInput/tagInput';
import { View, ViewHandler } from '@ui_lib/view';

class Expertise extends View {
  private tagInput?: TagInput;

  constructor() {
    super();
    const predefinedTags = [
      'Access Control',
      'Application Security',
      'Business Continuity',
      'Cloud Security',
      'Compliance',
      'Cryptography',
      'Data Protection',
      'DevSecOps',
      'Disaster Recovery',
      'Endpoint Security',
      'Forensic Analysis',
      'Identity Management',
      'Incident Response',
      'IoT Security',
      'Malware Analysis',
      'Mobile Security',
      'Network Security',
      'Penetration Testing',
      'Physical Security',
      'Reverse Engineering',
      'Risk Management',
      'Security Architecture',
      'Security Awareness',
      'Security Operations',
      'Threat Hunting',
      'Vulnerability Assessment',
      'Web Application Security',
      'Wireless Security',
      'Workstation Security',
    ];

    this.tagInput = new TagInput({ suggestions: predefinedTags });
  }

  render(q: Quark): void {
    $(q, 'div', 'expertise-details', {}, (q) => {
      this.tagInput?.render(q);
    });
  }
}
export const tagInputTestViewHandler = new ViewHandler('test/tagInput', Expertise);
