import { QuarkFunction as $, Quark } from '../../ui_lib/quark';
import './notFound.scss';

export default class NotFound {
  render(q: Quark) {
    $(q, 'div', 'not-found', {}, (q) => {
      $(q, 'h1', '', {}, (q) => {
        q.innerHTML = '404';
      });
      $(q, 'span', '', {}, (q) => {
        q.innerHTML = 'Page not found';
      });
    });
  }
}
