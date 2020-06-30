import { ValidationErrors, AbstractControl } from "@angular/forms";

export class TextValidators {
    static notFoundText(control: AbstractControl): ValidationErrors | null {
        if((control.value as string ).match(/[A-Za-z]/)) {
            return { notFoundText: true}
        }
    }
}