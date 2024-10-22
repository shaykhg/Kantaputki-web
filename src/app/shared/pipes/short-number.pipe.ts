import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortNumber'
})

/**
 * Takes a value and makes it appear as 5.2K instead of 5,200 and 1M instead of 10,00,000.
 */
export class ShortNumberPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
    if (isNaN(value)) { return null; } // will only work value is a number
    if (value === null) { return null; }
    if (value === 0) { return null; }
    const abs = Math.abs(value);
    // what tier? (determines SI symbol)
    // tslint:disable-next-line:no-bitwise
    const tier = Math.log10(abs) / 3 | 0;
    // if zero, we don't need a suffix
    if (tier === 0) { return abs; }

    // get suffix and determine scale
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);

    // scale the number
    const scaled = abs / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
  }

}
