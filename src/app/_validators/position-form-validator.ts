import { ValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';

export const PositionFormValidator = 
    (minWageField: string, maxWageField: string): ValidatorFn => {
        return (control: FormGroup): ValidationErrors | null => {           
            const minWage = control.get(minWageField); 
            const maxWage = control.get(maxWageField);

            const minWageValue: number = Number.parseInt(minWage.value);
            const maxWageValue: number = Number.parseInt(maxWage.value);

            if(minWage && maxWage && minWageValue > maxWageValue) {
                maxWage.setErrors({ invalidValue: true });
                return null;
            }

            maxWage.setErrors({ invalidValue: null });
            maxWage.updateValueAndValidity({ onlySelf: true });
            
            return null;
        }
}