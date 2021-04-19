import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'GoldenCrownsPipe'
  })
export class GoldenCrownsPipe implements PipeTransform {
    transform(pennyAmount: number) {
        return Math.floor((pennyAmount / 12) / 20);
    }
}

@Pipe({
    name: 'SilverPipe'
  })
export class SilverPipe implements PipeTransform {
    transform(pennyAmount: number) {
        const crowns = Math.floor((pennyAmount / 12) / 20);
        return Math.floor((pennyAmount / 12) - (crowns * 20));
    }
}

@Pipe({
    name: 'PennyPipe'
  })
export class PennyPipe implements PipeTransform {
    transform(pennyAmount: number) {
        return pennyAmount - ((Math.floor((pennyAmount / 12))) * 12);
    }
}

