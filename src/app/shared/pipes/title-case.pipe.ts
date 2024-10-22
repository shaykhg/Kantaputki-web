import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase'
})


/**
 * Takes a value and makes it lowercase.
 */
export class TitleCasePipe implements PipeTransform {

  transform(word: string): string {
    if (!word) { return word; }
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

}
