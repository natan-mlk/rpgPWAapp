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
        // const crowns = Math.floor((pensValue / 12) / 20);
        // const silver = Math.floor((pensValue / 12) - (crowns * 20));
        // pens = newAmount - ((Math.floor((newAmount / 12))) * 12);
        return pennyAmount - ((Math.floor((pennyAmount / 12))) * 12);
    }
}

