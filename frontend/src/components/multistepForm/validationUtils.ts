import ModalManager from '../ModalManager/ModalManager';
import { ValidationSchema } from './multistep-form';
// import { loadModalContent } from '../ModalManager/ModalManager';
// import validateErrorModalContent from '@alerts/alertOnlyCancel.html';
import { setContent, convertToDom } from '../ModalManager/ModalManager';
import { modalAlertOnlyCancel } from '@/main';

// Convert the HTML string to a DOM element
// const modalElement = convertToDom(validateErrorModalContent);

// Set text content of modal elements
// setContent(modalElement, {
//   '.modal-title': 'Validation Error',
// });
// Add event listeners to the modal buttons
// ModalManager.includeModal('validateErrorModal', {
//   '.button-cancel': () => ModalManager.hide('validateErrorModal'),
// });

const numberRegex = /^\d+$/; // Matches only numbers

const stringRegex = /^[a-zA-Z0-9 ]+$/; // Matches letters and numbers

const stringStrictRegex = /^[a-zA-Z ]+$/; // Matches only letters

const dayRegex = /^(0?[1-9]|[12][0-9]|3[01])$/; // Matches 01-31
const monthRegex = /^(0?[1-9]|1[0-2])$/; // Matches 01-12
const yearRegex = /^\d{4}$/; // Matches a four-digit year

const urlRegex = /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/; // Matches a valid URL

export function isValidDate(date: any): { result: boolean; message: string } {
  const isDayValid = dayRegex.test(date.day);
  const isMonthValid = monthRegex.test(date.month);
  const isYearValid = yearRegex.test(date.year);

  if (!isDayValid) {
    return { result: false, message: `{Invalid day format}` };
  }
  if (!isMonthValid) {
    return { result: false, message: `{Invalid month format}` };
  }
  if (!isYearValid) {
    return { result: false, message: `{Invalid year format}` };
  }

  return { result: true, message: '' };
}

export function validateField(key: string, value: any, expectedType: string): { result: boolean; message: string } {
  // Verifying a string
  if (expectedType === 'string') {
    if (!stringRegex.test(value)) {
      return { result: false, message: `{${key} must be a string}` };
    }
  }

  // Verifying a string(strict)
  if (expectedType === 'string-strict') {
    if (!stringStrictRegex.test(value)) {
      return { result: false, message: `{${key} must be strictly a string}` };
    }
  }

  // Verifying a date
  if (expectedType === 'date') {
    const dateValidation = isValidDate(value);
    if (!dateValidation.result) {
      return { result: false, message: `${key} is an invalid date: ${dateValidation.message}` };
    }
  }

  // Verifying an array of strings
  if (expectedType === 'array|string') {
    if (!Array.isArray(value)) {
      return { result: false, message: `${key} must be an array` };
    } else {
      for (const item of value) {
        if (!stringRegex.test(item)) {
          return { result: false, message: `${key} must be an array of strings` };
        }
      }
    }
  }

  // Verifying an array of strings(strict)
  if (expectedType === 'array|string-strict') {
    if (!Array.isArray(value)) {
      return { result: false, message: `${key} must be an array` };
    } else {
      for (const item of value) {
        if (!stringStrictRegex.test(item)) {
          return { result: false, message: `${key} must be an array of strictly strings` };
        }
      }
    }
  }

  // Verifying a number
  if (expectedType === 'number') {
    if (!numberRegex.test(value)) {
      return { result: false, message: `${key} must be a number` };
    }
  }
  return { result: true, message: '' };
}

export function validateFormState(formState: any, validationSchema: ValidationSchema): boolean {
  for (const key in validationSchema) {
    const fieldValidation = validateField(key, formState[key], validationSchema[key]);
    if (!fieldValidation.result) {
      // alert(fieldValidation.message);
      // console.log(validateErrorModalContent);
      setContent(modalAlertOnlyCancel, {
        '.modal-title': 'Validation Error',
        '.modal-message': fieldValidation.message,
      });
      ModalManager.show('alertOnlyCancel', modalAlertOnlyCancel);
      return false;
    }
  }
  return true;
}
