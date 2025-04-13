import { ValidationSchema } from './multistep-form';
import ModalManager, { convertToDom, setContent } from '@/components/ModalManager/ModalManager';
import { modalAlertOnlyOK } from '@/main';
import alertOnlyOK from '@alerts/alertOnlyOK.html';
// Convert the HTML string to a DOM element

export const validateErrorModal = convertToDom(alertOnlyOK);

// Set text content of modal elements
setContent(validateErrorModal, {
  '.modal-title': 'Validation Error',
  '.modal-message': 'Validation Error',
});
// Add event listeners to the modal buttons
ModalManager.includeModal('validateErrorModal', {
  '.button-ok': () => ModalManager.hide('validateErrorModal'),
});

const numberRegex = /^\d+$/; // Matches only numbers

const stringRegex = /^[a-zA-Z0-9& ]*$/; // Matches letters and numbers

const string2Regex = /^[a-zA-Z0-9]+ [a-zA-Z0-9]+$/; // Matches letters and numbers

const stringStrictRegex = /^[a-zA-Z& ]*$/; // Matches only letters

const dayRegex = /^(0?[1-9]|[12][0-9]|3[01])$/; // Matches 01-31
const monthRegex = /^(0?[1-9]|1[0-2])$/; // Matches 01-12
const yearRegex = /^\d{4}$/; // Matches a four-digit year

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Matches a valid email address

const urlRegex = /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/; // Matches a valid URL

const commaWithStringRegex = /^(?!,)(?!.*,$)([a-zA-Z0-9& _-]+(,\s*|,\s*|,\s*|,\s*)?)*$/; // Matches a comma-separated list of strings that do not start or end with a comma

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

const allowedExtensions = [
  'txt', 'csv', 'xlsx', 'pdf', 'log', 'json', 'py', 'sh', 'ps1', 'js', 'bat',
  'zip', 'png', 'jpg', 'jpeg', 'vsdx', 'drawio', 'xml', 'svg', 'pcap', 'pcapng'
];

export const isValidFileType = (filename: string): boolean => {
  const extension = filename.split('.').pop()?.toLowerCase();
  return allowedExtensions.includes(extension || '');
};

export function validateField(key: string, value: any, expectedType: string): { result: boolean; message: string } {
  // Verifying a string
  if (expectedType === 'string') {
    console.log('checking string: ', key, value);
    if (!stringRegex.test(value)) {
      return { result: false, message: `{${key} must be a string}` };
    }
  }

  // Verifying a string(strict)
  if (expectedType === 'string-strict') {
    console.log('checking string-strict: ', key, value);
    if (!stringStrictRegex.test(value)) {
      return { result: false, message: `{${key} must be strictly a string}` };
    }
  }

  // Verifying a date
  if (expectedType === 'date') {
    const dateValidation = isValidDate(value);
    console.log('checking date: ', key, value);
    if (!dateValidation.result) {
      return { result: false, message: `${key} is an invalid date: ${dateValidation.message}` };
    }
  }

  // Verifying an email
  if (expectedType === 'email') {
    console.log('checking email: ', key, value);
    if (!emailRegex.test(value)) {
      return { result: false, message: `${key} must be a valid email address` };
    }
  }

  // Verifying an array of strings
  if (expectedType === 'array|string') {
    console.log('checking array|string: ', key, value);
    if (!Array.isArray(value)) {
      console.log('array|string');
      console.log(key);
      console.log(value);
      return { result: false, message: `${key} must be an array` };
    } else {
      for (const item of value) {
        if (!stringRegex.test(item)) {
          return { result: false, message: `${key} must be an array of strings` };
        }
      }
    }
  }

  if (expectedType === 'object|string') {
    console.log('checking object|string: ', key, value);
    if (typeof value !== 'object') {
      console.log('object|string');
      console.log(key);
      console.log(value);
      return { result: false, message: `${key} must be an object` };
    } else {
      for (const item of Object.values(value)) {
        if (typeof item === 'string' && !stringRegex.test(item)) {
          return { result: false, message: `${key} must be an object of strings` };
        }
      }
    }
  }

  // Verifying an array of strings(strict)
  if (expectedType === 'array|string-strict') {
    console.log('checking array|string-strict: ', key, value);
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
    console.log('checking number: ', key, value);
    if (!numberRegex.test(value)) {
      return { result: false, message: `${key} must be a number` };
    }
  }

  // Verifying a number or null
  if (expectedType === 'number|null') {
    console.log('checking number|null: ', key, value);
    if (!numberRegex.test(value) && value !== null && value !== '') {
      return { result: false, message: `${key} must be a number or null` };
    }
  }

  // // Verifying a positive number or null
  // if (expectedType === 'positive-number|null') {
  //   console.log('checking positive-number|null: ', key, value);
  //   if (value === null || value === '') {
  //     return { result: true, message: '' };
  //   }

  //   const numValue = Number(value);
  //   if (isNaN(numValue) || numValue <= 0) {
  //     return { result: false, message: `${key} must be a positive number or null` };
  //   }
  // }

  // Verifying a url
  if (expectedType === 'url') {
    console.log('checking url: ', key, value);
    if (!urlRegex.test(value)) {
      return { result: false, message: `${key} must be a valid URL` };
    }
  }

  // Verifying a string(2)

  if (expectedType === 'string|2') {
    console.log('checking string|2: ', key, value);
    if (!string2Regex.test(value)) {
      return { result: false, message: `${key} must be a string with 2 words` };
    }
  }

  if (expectedType === 'string|comma') {
    console.log('checking string|comma: ', key, value);
    if (!commaWithStringRegex.test(value)) {
      return { result: false, message: `${key} must be a comma seperated list` };
    }
  }

  if (expectedType === 'file') {
    console.log('checking file type: ', key, value);
    if (!isValidFileType(value)) {
      return { result: false, message: `${key} must be a valid file type` };
    }
  }

  return { result: true, message: '' };
}

export function validateFormState(formState: any, validationSchema: ValidationSchema): boolean {
  for (const key in validationSchema) {
    const fieldValidation = validateField(key, formState[key], validationSchema[key]);
    if (!fieldValidation.result) {
      console.error('validation error: ', fieldValidation.message);
      setContent(modalAlertOnlyOK, {
        '.modal-title': 'Validation Error',
        '.modal-message': fieldValidation.message,
      });
      ModalManager.show('alertOnlyOK', modalAlertOnlyOK);
      return false;
    }
  }
  return true;
}
