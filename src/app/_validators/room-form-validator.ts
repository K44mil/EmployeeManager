import { ValidatorFn, ValidationErrors, FormGroup } from '@angular/forms';


export const RoomFormValidator = 
    (widthField: string, heightField: string, capacityField: string): ValidatorFn => {
        return (control: FormGroup): ValidationErrors | null => {
            const width = control.get(widthField);
            const height = control.get(heightField);
            const capacity = control.get(capacityField);

            const intWidth: number = Number.parseInt(width.value);
            const intHeight: number = Number.parseInt(height.value);

            const maxNumberOfDesks: number = Math.floor(intWidth/200) * Math.floor(intHeight/200);  

            if(width && height && capacity && Number.parseInt(capacity.value) > maxNumberOfDesks) {
                capacity.setErrors({ maxDesks: true });
                return null;
            }

            capacity.setErrors({ maxDesks: null });
            capacity.updateValueAndValidity({ onlySelf: true });

            return null;
        }
    }