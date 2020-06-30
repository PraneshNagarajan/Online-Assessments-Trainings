import { AbstractControl, ValidationErrors } from '@angular/forms';
export class CapsValidators {
    static firstCaps(control: AbstractControl): ValidationErrors | null {
        let value = (control.value as string).substring(0,1);
        if( value.length > 0) {
            if(!(value.match(/[A-Z]/))) {
                return {firstCaps: true};
            }
        } 
    return null;
    }

    static foundCaps(control: AbstractControl): ValidationErrors | null {
        if(!(control.value as string).match(/[A-Z]/)) {
            return { foundCaps: true};
        }
    }

    static foundLower(control: AbstractControl): ValidationErrors | null {
        if(!(control.value as string).match(/[a-z]/)) {
            return { foundLower: true};
        }
    }
   

}