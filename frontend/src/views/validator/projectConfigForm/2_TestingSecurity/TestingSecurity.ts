import { Quark } from '@/ui_lib/quark';
import { Step } from './../../../../components/multistepForm/multistep-form';
import './TestingSecurity.scss';
export class TestingSecurity implements Step {
  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    q.innerHTML = '';
  }
}
