import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { saveAs } from "file-saver";
import { BehaviorSubject, combineLatest, map, Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { DomainesOthersModel, ExporterModel, FilieresOthersModel, PromotionsOthersModel, 
    RegionsOthersModel, StatusProOthersModel } from "../models/others.model";

@Injectable()
export class OthersService {
    constructor(
        private zone: NgZone,
        private http: HttpClient
    ) {}

    private _current$ = new BehaviorSubject<boolean>(false);
    get current$(): Observable<boolean> {
        return this._current$.asObservable();
    }

    private _statuspro$ = new BehaviorSubject<StatusProOthersModel[]>([]);
    get statuspro$(): Observable<StatusProOthersModel[]> {
        return this._statuspro$.asObservable();
    }

    private _domaines$ = new BehaviorSubject<DomainesOthersModel[]>([]);
    get domaines$(): Observable<DomainesOthersModel[]> {
        return this._domaines$.asObservable();
    }

    private _filieres$ = new BehaviorSubject<FilieresOthersModel[]>([]);
    get filieres$(): Observable<FilieresOthersModel[]> {
        return this._filieres$.asObservable();
    }

    private _promotions$ = new BehaviorSubject<PromotionsOthersModel[]>([]);
    get promotions$(): Observable<PromotionsOthersModel[]> {
        return this._promotions$.asObservable();
    }

    private _regions$ = new BehaviorSubject<RegionsOthersModel[]>([]);
    get regions$(): Observable<RegionsOthersModel[]> {
        return this._regions$.asObservable();
    }

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }
    
    private setLoading(loading: boolean): void {
        this._loading$.next(loading);
    }

    lastLoaded = 0;

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

    getallChoices(): void {
        if(Date.now() - this.lastLoaded <= 300000) return;
        this.setLoading(true);
        combineLatest([
            this.http.get<StatusProOthersModel[]>(`${environment.apiUrl}/status-professionnels/all`),
            this.http.get<DomainesOthersModel[]>(`${environment.apiUrl}/domaine-competences/all`),
            this.http.get<FilieresOthersModel[]>(`${environment.apiUrl}/filieres/all`),
            this.http.get<PromotionsOthersModel[]>(`${environment.apiUrl}/promotions/all`),
            this.http.get<RegionsOthersModel[]>(`${environment.apiUrl}/regions/all`)
        ]).pipe(
            tap(([statuspro, domaines, filieres, promotions, regions]) => {
                this.lastLoaded = Date.now();
                this._statuspro$.next(statuspro);
                this._domaines$.next(domaines);
                this._filieres$.next(filieres);
                this._promotions$.next(promotions);
                this._regions$.next(regions);
                this.setLoading(false);
            })
        ).subscribe();
    }

    exportExcelFile(donnees: ExporterModel): void {
        this.setLoading(true);
        this.http.post(`${environment.apiUrl}/etudiants/find-filter`, 
            donnees, 
            {
                observe: 'body',
                responseType: 'blob'
            }).pipe(
            tap(response => {                
                saveAs(response, `Jeunes-S_${Date.now()}`);
                this.setLoading(false);
            })
        ).subscribe();
    }
}
