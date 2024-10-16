import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { TagInput } from '@components/text_field/tagInput/tagInput';
import { View, ViewHandler } from '@ui_lib/view';

class Expertise extends View {
  private tagInput?: TagInput;

  constructor() {
    super();
    const predefinedTags = ['Penetration Testing', 'Network Security', 'Web Application Security', 'Malware Analysis', 'Forensic Analysis', 'Threat Hunting', 'Vulnerability Assessment'];
    this.tagInput = new TagInput({ suggestions: predefinedTags });
  }

  render(q: Quark): void {
    $(q, 'div', 'expertise-details', {}, (q) => {
      this.tagInput?.render(q);
    });
  }
}
export const tagInputTestViewHandler = new ViewHandler('test/tagInput', Expertise);
