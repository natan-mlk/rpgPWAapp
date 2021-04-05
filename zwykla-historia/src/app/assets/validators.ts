import { AbstractControl, FormControl, ValidatorFn } from "@angular/forms";

export function isPositiveNumberValidator(control: FormControl): {[s: string]: boolean} {
    if(control.value < 0){
      return {isLessThanZero: true}
    }
    return null;
  }
// second way of writing validator
  export function isNotIntegerValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if(Number.isInteger(control.value) || control.value === null){
            return null;
          } else {
            return {isNotInteger: true}
          }
    }
  }
