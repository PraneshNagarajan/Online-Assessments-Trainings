import { ValidationErrors, AbstractControl } from "@angular/forms";

export class LowerCaseValidators {
    static foundText(control: AbstractControl): ValidationErrors | null {
        let input = (control.value as string);
        if(input) {
        if(!(input.substring(1) === input.substring(1).toLowerCase())) {
            return { foundText: true}
        }
    }
    }
}