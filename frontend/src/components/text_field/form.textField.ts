import { TextField, TextFieldOptions } from './base';

interface FormTextFieldOptions extends TextFieldOptions {
  value: string;
}

class FormTextField extends TextField {
  constructor(options: FormTextFieldOptions) {
    super(options);
  }
}

export { FormTextField };
