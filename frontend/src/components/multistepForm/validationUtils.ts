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

const stringRegex = /^[\s\S]*$/; // Matches letters and numbers

const string2Regex = /^[a-zA-Z0-9]+ [a-zA-Z0-9]+$/; // Matches letters and numbers

const stringStrictRegex = /^[a-zA-Z& ]*$/; // Matches only letters

const singleWordRegex = /^[a-zA-Z]*$/; // Matches letters and numbers

const dayRegex = /^(0?[1-9]|[12][0-9]|3[01])$/; // Matches 01-31
const monthRegex = /^(0?[1-9]|1[0-2])$/; // Matches 01-12
const yearRegex = /^\d{4}$/; // Matches a four-digit year

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Matches a valid email address

const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

const telRegex = /^\d{10}$/; // Matches a 10-digit number

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

const allowedExtensions = ['txt', 'csv', 'xlsx', 'pdf', 'log', 'json', 'py', 'sh', 'ps1', 'js', 'bat', 'zip', 'png', 'jpg', 'jpeg', 'vsdx', 'drawio', 'xml', 'svg', 'pcap', 'pcapng'];
const allowedExtensionsCert = ['png', 'hiec', 'jpg', 'jpeg', 'pdf'];

export const isValidFileType = (file: File, strict: boolean): boolean => {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  if (strict) {
    return allowedExtensionsCert.includes(extension) && isValidFileSize(file);
  } else {
    return allowedExtensions.includes(extension) && isValidFileSizeStrict(file);
  }
};

export const isValidFileSize = (file: File): boolean => {
  const maxSizeInBytes = 100 * 1024 * 1024; // 100 MB
  return file.size <= maxSizeInBytes;
};

export const isValidFileSizeStrict = (file: File): boolean => {
  const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB
  return file.size <= maxSizeInBytes;
};

export function validateField(key: string, value: any, expectedType: string | ((formState: any) => string)): { result: boolean; message: string } {
  // Check if expectedType is a function
  if (typeof expectedType === 'function') {
    // The function should return the validation type string
    const dynamicType = expectedType(value);
    // Recursively call validateField with the dynamic type
    return validateField(key, value, dynamicType);
  }

  // Verifying a string
  if (expectedType === 'string') {
    // console.log('checking string: ', key, value);
    if (!stringRegex.test(value)) {
      return { result: false, message: `{${key} must be a string}` };
    }
  }

  // Verifying a string(strict)
  if (expectedType === 'string-strict') {
    // console.log('checking string-strict: ', key, value);
    if (!stringStrictRegex.test(value)) {
      return { result: false, message: `{${key} must be strictly a string}` };
    }
  }

  if (expectedType === 'single-word') {
    if (!singleWordRegex.test(value)) {
      return { result: false, message: `{${key} must be valid}` };
    }
  }

  if (expectedType === 'tel') {
    if (!telRegex.test(value)) {
      return { result: false, message: `{${key} must be a valid phone number}` };
    }
  }
  // Verifying a date
  if (expectedType === 'date') {
    const dateValidation = isValidDate(value);
    // console.log('checking date: ', key, value);
    if (!dateValidation.result) {
      return { result: false, message: `${key} is an invalid date: ${dateValidation.message}` };
    }
  }

  if (expectedType === 'date|future') {
    const dateValidation = isValidDate(value);
    // console.log('checking date: ', key, value);
    if (!dateValidation.result) {
      return { result: false, message: `${key} is an invalid date: ${dateValidation.message}` };
    }
    const today = new Date();
    const inputDate = new Date(`${value.year}-${value.month}-${value.day}`);
    if (inputDate <= today) {
      return { result: false, message: `${key} must be a future date` };
    }
  }

  if (expectedType === 'date|past') {
    const dateValidation = isValidDate(value);
    if (!dateValidation.result) {
      return { result: false, message: `${key} is an invalid date: ${dateValidation.message}` };
    }
    const today = new Date();
    const inputDate = new Date(`${value.year}-${value.month}-${value.day}`);
    if (inputDate >= today) {
      return { result: false, message: `${key} must be a past date` };
    }
  }

  if (expectedType === 'date|future|min-date') {
    return { result: false, message: `Project end date must be after start date` };
  }

  // Verifying an email
  if (expectedType === 'email') {
    // console.log('checking email: ', key, value);
    if (!emailRegex.test(value)) {
      return { result: false, message: `${key} must be a valid email address` };
    }
  }

  // Verifying an array of strings
  if (expectedType === 'array|string') {
    // console.log('checking array|string: ', key, value);
    if (!Array.isArray(value)) {
      // console.log('array|string');
      // console.log(key);
      // console.log(value);
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
      // console.log('object|string');
      // console.log(key);
      // console.log(value);
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
    // console.log('checking array|string-strict: ', key, value);
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
    // console.log('checking number: ', key, value);
    if (!numberRegex.test(value)) {
      return { result: false, message: `${key} must be a number` };
    }
  }

  // Verifying a number or null
  if (expectedType === 'number|null') {
    // console.log('checking number|null: ', key, value);
    if (!numberRegex.test(value) && value !== null && value !== '') {
      return { result: false, message: `${key} must be a number or null` };
    }
  }
  if (expectedType === 'ignore') {
    return { result: true, message: '' };
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
    // console.log('checking url: ', key, value);
    // console.log(urlRegex.test(value));
    if (!urlRegex.test(value)) {
      return { result: false, message: `${key} must be a valid URL` };
    }
    // console.log('No validation error');
  }

  // Verifying a string(2)

  if (expectedType === 'string|2') {
    // console.log('checking string|2: ', key, value);
    if (!string2Regex.test(value)) {
      return { result: false, message: `${key} must be a string with 2 words` };
    }
  }

  if (expectedType === 'string|comma') {
    // console.log('checking string|comma: ', key, value);
    if (!commaWithStringRegex.test(value)) {
      return { result: false, message: `${key} must be a comma seperated list` };
    }
  }

  if (expectedType === 'file') {
    // console.log('checking file type: ', key, value);
    if (!isValidFileType(value, false)) {
      return { result: false, message: `${key} must be a valid file type` };
    }
  }

  if (expectedType === 'file-strict') {
    // console.log('checking file type: ', key, value);
    if (!isValidFileType(value, true)) {
      return { result: false, message: `${key} must be a valid file type` };
    }
  }

  return { result: true, message: '' };
}

export function validateFormState(formState: any, validationSchema: ValidationSchema): boolean {
  for (const key in validationSchema) {
    const expectedType = validationSchema[key];
    let fieldValidation;

    // Handle function type validators differently
    if (typeof expectedType === 'function') {
      // Get the validation type dynamically from the function
      const dynamicType = expectedType(formState);
      // Then validate with that type
      fieldValidation = validateField(key, formState[key], dynamicType);
    } else {
      // Regular string-based validation
      fieldValidation = validateField(key, formState[key], expectedType);
    }

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
