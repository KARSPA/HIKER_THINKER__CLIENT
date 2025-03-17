/* Vérifier que la valeur de l'input d'unité de durée est bien "jours" ou "heures" */

import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validDurationUnit(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const allowedUnits = ["jours", "heures"];
        if (allowedUnits.includes(control.value)) {
            return null;
        }
        return { invalidDurationUnit: true };
    };
  }