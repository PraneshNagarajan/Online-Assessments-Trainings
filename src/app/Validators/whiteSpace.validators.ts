import { ValidationErrors, AbstractControl } from "@angular/forms";

export class WhiteSpaceValidators {
    static noSpace(control: AbstractControl): ValidationErrors | null {
        if(control.value) {
        if((control.value as string ).match(' ')) {
            return { noSpace: true}
        }
    }
    }
}