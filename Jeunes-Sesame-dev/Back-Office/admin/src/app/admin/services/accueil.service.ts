import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { NombreModel, PromotionsModel, Stat1Model } from "../models/accueil.model";

@Injectable()
export class AccueilService {
    constructor(
        private http: HttpClient
    ) {}

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    private setLoadingStatus(loading: boolean): void {
        this._loading$.next(loading);
    }

    private _total$ = new BehaviorSubject<NombreModel>({nombre: 0, pourcentage: ''});
    get total$(): Observable<NombreModel> {
        return this._total$.asObservable();
    }

    private _inserer$ = new BehaviorSubject<NombreModel>({nombre: 0, pourcentage: ''});
    get inserer$(): Observable<NombreModel> {
        return this._inserer$.asObservable();
    }

    private _recherche$ = new BehaviorSubject<NombreModel>({nombre: 0, pourcentage: ''});
    get recherche$(): Observable<NombreModel> {
        return this._recherche$.asObservable();
    }

    private _etudes$ = new BehaviorSubject<NombreModel>({nombre: 0, pourcentage: ''});
    get etudes$(): Observable<NombreModel> {
        return this._etudes$.asObservable();
    }
    
    private _stat1$ = new BehaviorSubject<Stat1Model[]>([]);
    get stat1$(): Observable<Stat1Model[]> {
        return this._stat1$.asObservable();
    }

    private _stat2$ = new BehaviorSubject<NombreModel[]>([]);
    get stat2$(): Observable<NombreModel[]> {
        return this._stat2$.asObservable();
    }

    private _promotions$ = new BehaviorSubject<PromotionsModel[]>([]);
    get promotions$(): Observable<PromotionsModel[]> {
        return this._promotions$.asObservable();
    }

    lastLoadedStat1 = 0;

    getCountTotal(): void {
        if(Date.now() - this.lastLoadedStat1 <= 300000) return;
        this.http.get<NombreModel>(`${environment.apiUrl}/etudiants/count/actif/1`).pipe(
            tap(response => {
                this._total$.next(response);
            })
        ).subscribe();
    }

    getCountInserer(): void {
        if(Date.now() - this.lastLoadedStat1 <= 300000) return;
        this.http.get<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/1`).pipe(
            tap(response => {
                this._inserer$.next(response);
            })
        ).subscribe();
    }

    getCountRecherche(): void {
        if(Date.now() - this.lastLoadedStat1 <= 300000) return;
        this.http.get<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/2`).pipe(
            tap(response =>{
                this._recherche$.next(response);
            })
        ).subscribe();
    }

    getCountEtudes(): void {
        if(Date.now() - this.lastLoadedStat1 <= 300000) return;
        this.http.get<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/3`).pipe(
            tap(response => {
                this._etudes$.next(response);
            })
        ).subscribe();
    }

    getCountStat1(): void {
        if(Date.now() - this.lastLoadedStat1 <= 300000) return;
        this.http.get<Stat1Model[]>(`${environment.apiUrl}/promotions/count/status-pro/1`).pipe(
            map(response => response.map(value => ({
                ...value,
                promotion: value.promotion.toLowerCase().replace('promotion', '').trim(),
                pourcentage: value.pourcentage!.replace('%', '').trim()
              }))),
            tap(response => {
                this.lastLoadedStat1 = Date.now();
                this._stat1$.next(response);                
            })
        ).subscribe();
    }

    getCountStat2(): void {
        this.setLoadingStatus(true);
        combineLatest([
            this.http.get<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/1`),
            this.http.get<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/2`),
            this.http.get<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/3`)
        ]).pipe(
            map(response => response.map(value => ({
                ...value,
                pourcentage: value.pourcentage!.replace('%', '').trim()
              }))),
            tap(response => {
                this._stat2$.next(response);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    filtreStat2(promotion_id: number): void {
        this.setLoadingStatus(true);
        if(promotion_id === 0) {
            combineLatest([
                this.http.get<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/1`),
                this.http.get<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/2`),
                this.http.get<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/3`)
            ]).pipe(
                map(response => response.map(value => ({
                    ...value,
                    pourcentage: value.pourcentage!.replace('%', '').trim()
                  }))),
                tap(response => {
                    this._stat2$.next(response);
                    this.setLoadingStatus(false);
                })
            ).subscribe();
        }
        else {
            combineLatest([
                this.http.post<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/promotion`, 
                    {status_id: 1, promotion_id}),
                this.http.post<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/promotion`,
                    {status_id: 2, promotion_id}),
                this.http.post<NombreModel>(`${environment.apiUrl}/etudiants/count/status-pro/promotion`,
                    {status_id: 3, promotion_id})
            ]).pipe(
                map(response => response.map(value => ({
                    ...value,
                    pourcentage: value.pourcentage!.replace('%', '').trim()
                  }))),
                tap(response => {
                    this._stat2$.next(response);
                    this.setLoadingStatus(false);
                })
            ).subscribe();
        }
    }

    getPromotions(): void {
        if(Date.now() - this.lastLoadedStat1 <= 300000) return;
        this.http.get<PromotionsModel[]>(`${environment.apiUrl}/promotions/all`).pipe(
            map(response => response.map(value => ({
                ...value,
                nom: value.nom.toLowerCase().replace('promotion', '').trim()
            }))),
            tap(response => this._promotions$.next(response))
        ).subscribe();
    }
}