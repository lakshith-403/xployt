import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';
import { View, ViewHandler } from '../../../ui_lib/view';
import './tabsTest.scss';

class TabsTestView implements View {
  params: { type: string };

  constructor(params: { type: string }) {
    this.params = params;
  }

  render(q: Quark): void {
    $(q, 'div', 'tabsTest ', {}, (q) => {
      $(q, 'span', '', {}, (q) => {
        q.innerHTML = 'TabsTest';
      });
    });
  }
}

export const tabsTestViewHandler = new ViewHandler('/tabs', TabsTestView);
