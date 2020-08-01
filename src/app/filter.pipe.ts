import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], args: any, args1?: any) {
    let array = [];
    if (args1) {
      for (let i = 0; i < value.length; i++) {
        if (args === i) {
          array.push(value[i]);
        }
      }
      return array;
    } else {
      for (let i = 0; i < value[0]['assessment'].length; i++) {
        if (args === i) {
          array.push(value[0]['assessment'][i]);
        }
      }
      return array;
    }
  }
}
