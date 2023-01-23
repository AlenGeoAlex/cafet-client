import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolean'
})
export class BooleanPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value === null || value === undefined)
      return "The value provided is unknown!";


    if(typeof value === 'string'){
      value = this.getBoolean(value);
      if(value === null)
        throw new Error("The string value provided must be either true or false")
    }else if(typeof value !== 'boolean'){
      throw new Error("The value provided doesn't match")
    }

    if(args.length < 2)
      throw new Error("Arguments to finish is missing! Follow the format : boolean : 'value-if-true':'value-if-false'");

    if(value)
      return args[0];
    else return args[1];
  }

  getBoolean(val : string) : boolean | null{
    if(val === "true")
      return true;
    else if(val === "false")
      return false;
    else return null;
  }

}
