import { AbstractControl, ValidatorFn } from '@angular/forms';
import { GenericConstants } from '../constants/app-generic-constants';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const emailField = control.value;

    if (!emailField) {
      return { emailInvalid: true };
    }

    const emailPattern = GenericConstants.VALIDATION_EMAIL_REGEX;
    const isValidEmail = emailPattern.test(emailField);
    const isValidLength =
      emailField.length > GenericConstants.VALIDATION_EMAIL_MIN_LENGTH &&
      emailField.length < GenericConstants.VALIDATION_EMAIL_Max_LENGTH;

    return isValidEmail && isValidLength ? null : { emailInvalid: true };
  };
}
