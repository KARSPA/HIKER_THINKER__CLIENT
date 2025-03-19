import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Category } from '../../interfaces/equipment/Category';

export function duplicateCategoryValidator(
  existing: Category[],
  currentId?: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = (control.value ?? '').trim().toLowerCase();
    if (!name) return null;

    const duplicate = existing.some(cat =>
      cat.name.trim().toLowerCase() === name &&
      // Ignorer la catégorie en cours de modification (si fournie)
      cat.id !== currentId
    );

    return duplicate ? { duplicateCategory: true } : null;
  };
}