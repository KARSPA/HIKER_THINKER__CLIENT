/** Les mots de passes doivent être égaux à l'inscription */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const samePasswordValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirm = control.get('confirmPassword');
    return password && confirm && password.value === confirm.value ? null :{arePwdEqual: true};
  };