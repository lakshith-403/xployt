import { ViewHandler } from '@/ui_lib/view';
import { QuarkFunction as $, Quark } from '@ui_lib/quark';
import { View } from '@ui_lib/view';

export class ValidatorApplications extends View {
  constructor() {
    super();
  }

  async render(q: Quark): Promise<void> {
    q.innerHTML = '';
    $(q, 'div', 'validator-applications', {}, (q) => {
      $(q, 'h1', 'validator-applications-title', {}, 'Validator Applications');
    });
  }
}

export const validatorApplicationsViewHandler = new ViewHandler('validator-applications', ValidatorApplications);
