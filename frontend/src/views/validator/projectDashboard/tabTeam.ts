import { Quark } from '../../../ui_lib/quark';
import { CollapsibleBase } from '../../../components/Collapsible/collap.base';
import { CACHE_STORE } from '../../../data/cache';

export default class Team {
  constructor(private projectId: string) {}

  render(q: Quark): void {
    const projectLeadCollapsible = new CollapsibleBase('Project Lead', '');
    projectLeadCollapsible.render(q);

    const clientCollapsible = new CollapsibleBase('Client', '');
    clientCollapsible.render(q);

    const hackerCollapsible = new CollapsibleBase('Hacker', '');
    hackerCollapsible.render(q);
    const validatorCollapsible = new CollapsibleBase('Validator', '');
    validatorCollapsible.render(q);
  }
}
