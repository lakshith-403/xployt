import { Quark } from '@/ui_lib/quark';
import { Step } from '../../../../components/multistepForm/multistep-form';
import './Payments.scss';

export class Payment implements Step {
  render(q: Quark, state: any, updateParentState: (newState: any) => void): void {
    q.innerHTML = '';
  }
}
