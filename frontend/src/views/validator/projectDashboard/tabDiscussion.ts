import { Quark } from '../../../ui_lib/quark';

export default class Discussion {
  render(q: Quark): void {
    q.innerHTML = 'Content for Team Tab';
  }
}
