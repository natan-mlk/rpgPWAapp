import { FormControl } from "@angular/forms";

export function isPositiveNumberValidator(control: FormControl): {[s: string]: boolean} {
    if(control.value < 0){
      return {isLessThanZero: true}
    }
    return null;
  }

  export function isNotIntegerValidator(control: FormControl): {[s: string]: boolean} {
    if(Number.isInteger(control.value) || control.value === null){
      return null;
    } else {
      return {isNotInteger: true}
    }
  }


  // Number.isInteger(value)

//   export function blue(): ValidatorFn {  
//     return (control: AbstractControl): { [key: string]: any } | null =>  
//         control.value?.toLowerCase() === 'blue' 
//             ? null : {wrongColor: control.value};
// }

// this.flagQuiz = fb.group({
//     firstColor: new FormControl('', blue()),


//   export const myValidator: ValidatorFn = /* ... */;