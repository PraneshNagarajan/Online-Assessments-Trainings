import { AbstractControl, ValidationErrors } from "@angular/forms"

export class IntegerValidators {
    static notFoundInteger(control: AbstractControl): ValidationErrors | null {
        if((control.value).match(/[0-9]/)) {
            return { notFoundInteger: true}
         }
    return null;
        
    }
    static foundInteger(control: AbstractControl): ValidationErrors | null {
        if(!(control.value).match(/[0-9]/)) {
            return { foundInteger: true}
        }
    }
}

