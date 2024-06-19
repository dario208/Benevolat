import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
    transform(value: string, maxLength: number = 11) {
        if(value.length <= maxLength) return value;
        return value.substring(0, maxLength - 4)+'...';
    }
}
