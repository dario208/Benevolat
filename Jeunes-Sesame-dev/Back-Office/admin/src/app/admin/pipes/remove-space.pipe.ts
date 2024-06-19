import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'removespace'
})
export class RemoveSpace implements PipeTransform {
    transform(value: string | null) {
        if(!value) return;
        return value.split(' ').join('');
    }
}
