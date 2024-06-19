import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { EmploisModel } from "../models/emplois.model";

@Injectable()
export class EmploisService {
    constructor(
        private zone: NgZone
    ) {}

    private _emplois$ = new BehaviorSubject<EmploisModel[]>([]);
    get emplois$(): Observable<EmploisModel[]> {
        return this._emplois$.asObservable();
    }

    getEmplois(): void {
        new Observable(observer => {
            const eventSource = new EventSource(`${environment.apiUrl}/emplois/sse-all`);
            eventSource.onmessage = ({data}) => {
                this.zone.run(() => observer.next(JSON.parse(data) as EmploisModel[]))
            };
            eventSource.onerror = error => {
                this.zone.run(() => observer.error(error));
            };
        }).pipe(
            tap(response => this._emplois$.next(response as EmploisModel[]))
        ).subscribe();
    }
}