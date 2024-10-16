import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { TagInput } from '@components/text_field/tagInput/tagInput';
import { FormTextField } from '@/components/text_field/form.text_field';
import { View, ViewHandler } from '@ui_lib/view';

class Expertise extends View {
  private tagInput?: TagInput;
  private textField?: FormTextField;

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

    this.tagInput = new TagInput({ suggestions: predefinedTags, label: 'Areas of Expertise', placeholder: 'Add an area of expertise' });
    this.textField = new FormTextField({ parentClass: 'label-left', class: 'expertise-details', label: 'Areas of Expertise', placeholder: 'Add an area of expertise' });
  }

  render(q: Quark): void {
    $(q, 'div', 'expertise-details', {}, (q) => {
      this.tagInput?.render(q);
    });
    $(q, 'div', 'expertise-details', {}, (q) => {
      this.textField?.render(q);
    });
  }
}
export const tagInputTestViewHandler = new ViewHandler('test/tagInput', Expertise);
