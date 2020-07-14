import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], args: any) {
    let array =[]; 
    for(let i = 0; i < value.length; i++) {
      if(args === i) {
        array.push(value[i]);
      }
    }
    return array;
  }

}
