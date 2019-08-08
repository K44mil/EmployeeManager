import { ValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';

export const PositionFormValidator = 
    (nameField: string, minWageField: string, maxWageField: string): ValidatorFn => {
        return (control: FormGroup): ValidationErrors | null => {
            // TODO: Validator logic
            // ---
            return null;
        }
}