import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { DomainesOtherModel, FilieresOtherModel, PromotionsOtherModel, 
    RegionsOtherModel, StatusOtherModel } from "../models/other.model";

@Injectable()
export class OtherService {
    constructor(
        private http: HttpClient,
        private zone: NgZone
    ) {}
    
    private _promotions$ = new BehaviorSubject<PromotionsOtherModel[]>([]);
    get promotions(): Observable<PromotionsOtherModel[]> {
        return this._promotions$.asObservable();
    }

    private _regions$ = new BehaviorSubject<RegionsOtherModel[]>([]);
    get regions(): Observable<RegionsOtherModel[]> {
        return this._regions$.asObservable();
    }

    private _domaines$ = new BehaviorSubject<DomainesOtherModel[]>([]);
    get domaines(): Observable<DomainesOtherModel[]> {
        return this._domaines$.asObservable();
    }

    private _filieres$ = new BehaviorSubject<FilieresOtherModel[]>([]);
    get filieres(): Observable<FilieresOtherModel[]> {
        return this._filieres$.asObservable();
    }

    private _status$ = new BehaviorSubject<StatusOtherModel[]>([]);
    get status(): Observable<StatusOtherModel[]> {
        return this._status$.asObservable();
    }

    private _current$ = new BehaviorSubject<boolean>(false);
    get current$(): Observable<boolean> {
        return this._current$.asObservable();
    }

    lastOthersLoaded = 0;

    getCurrent(): void {
        new Observable(observer => {
            const eventSource = new EventSource(`${environment.apiUrl}/emplois/sse-current`);
            eventSource.onmessage = ({data}) => {
                this.zone.run(() => observer.next(JSON.parse(data) as {current: boolean}));
            };
            eventSource.onerror = error => {
                this.zone.run(() => observer.error(error));
            };
        }).pipe(
            map(response => (response as {current: boolean}).current),
            tap(current => this._current$.next(current))
        ).subscribe();
    }

    getOthers(): void {
        if(Date.now() - this.lastOthersLoaded <= 300000) return;
        combineLatest([
            this.http.get<PromotionsOtherModel[]>(`${environment.apiUrl}/promotions/all`),
            this.http.get<RegionsOtherModel[]>(`${environment.apiUrl}/regions/all`),
            this.http.get<DomainesOtherModel[]>(`${environment.apiUrl}/domaine-competences/all`),
            this.http.get<FilieresOtherModel[]>(`${environment.apiUrl}/filieres/all`),
            this.http.get<StatusOtherModel[]>(`${environment.apiUrl}/status-professionnels/all`)
        ]).pipe(
            tap(([promotions, regions, domaines, filieres, status]) => {
                this.lastOthersLoaded = Date.now();
                this._promotions$.next(promotions);
                this._regions$.next(regions);
                this._domaines$.next(domaines);
                this._filieres$.next(filieres);
                this._status$.next(status);
            })
        ).subscribe();
    }
}