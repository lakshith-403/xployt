import { Quark } from '@/ui_lib/quark';

export default class Client {
  render(q: Quark): void {
    q.innerHTML = 'Content for Client';
  }
}
