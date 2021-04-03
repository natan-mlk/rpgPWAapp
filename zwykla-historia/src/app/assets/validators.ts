import { FormControl } from "@angular/forms";

export function isPositiveNumberValidator(control: FormControl): {[s: string]: boolean} {
    if(control.value < 0){
      return {isLessThanZero: true}
    }
    return null;
  }

//   export const myValidator: ValidatorFn = /* ... */;