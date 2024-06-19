import { HttpClient } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { CategorieModel, CreateEmploisModel, DomaineModel, 
    EmploisModel, StatusModel, UpdateEmploisModel } from "../models/emplois.model";

@Injectable()
export class EmploisService {
    constructor(
        private http: HttpClient,
        private zone: NgZone
    ) {}

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    private setLoading(status: boolean): void {
        this._loading$.next(status);
    }

    private _emplois$ = new BehaviorSubject<EmploisModel[]>([]);
    get emplois$(): Observable<EmploisModel[]> {
        return this._emplois$.asObservable();
    }

    private _domaine$ = new BehaviorSubject<DomaineModel[]>([]);
    get domaine$(): Observable<DomaineModel[]> {
        return this._domaine$.asObservable();
    }

    private _categorie$ = new BehaviorSubject<CategorieModel[]>([]);
    get categorie$(): Observable<CategorieModel[]> {
        return this._categorie$.asObservable();
    }

    private _status$ = new BehaviorSubject<StatusModel[]>([]);
    get status$(): Observable<StatusModel[]> {
        return this._status$.asObservable();
    }

    lastLoaded = 0;

    getEmplois(): void {
        if(Date.now() - this.lastLoaded <= 180000) return;
        new Observable(observer =>  {
            const eventSource =  new EventSource(`${environment.apiUrl}/emplois/sse-all`);
            eventSource.onmessage = ({data}) => {
                this.zone.run(() => observer.next(JSON.parse(data) as EmploisModel[]));
            };
            eventSource.onerror = error => {
                this.zone.run(() => observer.error(error));
            };
        }).pipe(
            tap(response => this._emplois$.next(response as EmploisModel[]))
        ).subscribe();
    }

    getCombineall(): void {
        if(Date.now() - this.lastLoaded <= 180000) return;
        this.setLoading(true);
        combineLatest([
            this.http.get<CategorieModel[]>(`${environment.apiUrl}/categorie-emplois/all`),
            this.http.get<DomaineModel[]>(`${environment.apiUrl}/domaine-competences/all`),
            this.http.get<StatusModel[]>(`${environment.apiUrl}/status-professionnels/all`)
        ]).pipe(
            tap(([categorie, domaine, status]) => {
                this.lastLoaded = Date.now();
                this._categorie$.next(categorie);
                this._domaine$.next(domaine);
                this._status$.next(status);
                this.setLoading(false);
            })
        ).subscribe();
    }

    createEmploi(donnees: CreateEmploisModel): void {
        this.setLoading(true);
        this.http.post(`${environment.apiUrl}/emplois/create`, donnees).pipe(
            tap(() => this.setLoading(false))
        ).subscribe();
    }

    updateEmplois(donnees: UpdateEmploisModel): void {
        this.setLoading(true);
        this.http.put(`${environment.apiUrl}/emplois/update`, donnees).pipe(
            tap(() => this.setLoading(false))
        ).subscribe();
    }

    deleteEmplois(donnees: number): void {
        this.setLoading(true);
        this.http.delete(`${environment.apiUrl}/emplois/delete/${donnees}`).pipe(
            tap(() => this.setLoading(false))
        ).subscribe();
    }
}
