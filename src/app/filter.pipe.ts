import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], args: any) {
    let array =[];
    console.log("filter", value);
    console.log("args:", args);
    for(let i = 0; i < value.length; i++) {
      if(args === i) {
        array.push(value[i]);
        console.log("final value:",value[i]);
      }
    }
    return array;
  }

}
