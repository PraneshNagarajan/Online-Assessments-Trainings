import { ValidationErrors, AbstractControl } from "@angular/forms";
export class CommonValidators {
    static foundEmailCharPattern(control: AbstractControl): ValidationErrors| null {
        if(!((control.value as string).match(/[@]/) && (control.value as string).match('.com')))  {
            return {foundEmailCharPattern: true};
        }
    }

    static foundEmailTextPattern(control: AbstractControl): ValidationErrors| null {
        if(! (((control.value as string).split('@')[0].length > 0) && (!(control.value as string).split('.')[0].endsWith('@')))) {
            return {foundEmailTextPattern: true};
        }
    }
}