import { Quark } from '@ui_lib/quark';

export default class Discussion {
  constructor(private projectId: string) {}

  render(q: Quark): void {
    q.innerHTML = 'Content for Team Tab';
  }
}
