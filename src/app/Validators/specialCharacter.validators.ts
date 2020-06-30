import { AbstractControl, ValidationErrors } from "@angular/forms";

export class SpecialCharacterValidators {
    static notFoundCharacter(control: AbstractControl): ValidationErrors| null {
        if((control.value as string).match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?*$]/)) {
            return {notFoundCharacter: true};
        }
    }

    static foundCharacter(control: AbstractControl): ValidationErrors| null {
        if(!(control.value as string).match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?*$]/)) {
            return {foundCharacter: true};
        }
    }

    static foundDashCharacter(control: AbstractControl): ValidationErrors| null {
        if((control.value as string).match(/[!@#$%^&*()_+\=\[\]{};':"\\|,.<>?*$]/)) {
            return {foundDashCharacter: true};
        }
    }

}