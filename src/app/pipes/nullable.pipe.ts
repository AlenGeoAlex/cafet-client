import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullable'
})
export class NullablePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): any | string {
    if(value !== null)
      return value;

    if(args.length >= 1){
      const param = args[0];
      if(param !== undefined)
        return String(param);
      else return "Unknown";
    }
  }

}
