import { QuarkFunction as $, Quark } from '../../ui_lib/quark.js';
import './loadingScreen.scss';

export default function ProjectInfo(q: Quark) {
  return $(q, 'div', 'loading-screen', {}, (q) => {
    $(q, 'div', 'spinner', {}, (q) => {});
  });
}
