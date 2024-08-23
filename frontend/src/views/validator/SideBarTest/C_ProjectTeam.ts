import { QuarkFunction as $, Quark } from '../../../ui_lib/quark';

export default function ProjectInfo(q: Quark) {
  return $(q, 'div', '', {}, (q) => {
    $(q, 'h2', '', {}, (q) => {
      q.innerHTML = 'Project Team';
    });
    $(q, 'div', '', {}, (q) => {
      q.innerHTML = 'This is the project information content.';
    });
  });
}
