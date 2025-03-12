/** Un input de type text ne peut être 'vides' (que des espaces par exemple) */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/** An actor's name can't match the given regular expression */
export function notBlankValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const isBlank = control.value?.trim() === "";
        return isBlank ? {isBlank: true} : null;
    };
  }