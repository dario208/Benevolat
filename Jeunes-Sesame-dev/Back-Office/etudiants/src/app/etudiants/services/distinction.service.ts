import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { CreateDistinctionModel, DistinctionModel, UpdateDistinctionModel } from "../models/distinction.model";

@Injectable()
export class DistinctionsService {
    constructor(
        private http: HttpClient
    ) {}

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    private _distinctions$ = new BehaviorSubject<DistinctionModel[]>([]);
    get distinctions$(): Observable<DistinctionModel[]> {
        return this._distinctions$.asObservable();
    }

    lastDistinctionsLoaded = 0;

    getDistinctions(): void {
        if(Date.now() - this.lastDistinctionsLoaded <= 180000) return;
        this.setLoadingStatus(true);
        this.http.get<DistinctionModel[]>(`${environment.apiUrl}/distinctions/etudiants`).pipe(
            tap(distinctions => {
                this.lastDistinctionsLoaded = Date.now();
                this._distinctions$.next(distinctions);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    createDistinction(donnees: CreateDistinctionModel): void {
        this.setLoadingStatus(true);
        this.http.post(`${environment.apiUrl}/distinctions/create`, donnees).pipe(
            switchMap(() => this.http.get<DistinctionModel[]>(`${environment.apiUrl}/distinctions/etudiants`)),
            take(1),
            tap(distinctions => {
                this._distinctions$.next(distinctions);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    updateDistinction(donnees: UpdateDistinctionModel): void {
        this.setLoadingStatus(true);
        this.distinctions$.pipe(
            take(1),
            map(distinctions => distinctions
                .map(distinction => distinction.id === donnees.id ? {
                    ...distinction,
                    nom: donnees.nom_distinction,
                    organisateur: donnees.organisateur,
                    lieu: donnees.lieu,
                    annee: donnees.annees,
                    description: donnees.description
                }: distinction)),
            tap(distinctions => this._distinctions$.next(distinctions)),
            switchMap(() => this.http.put(`${environment.apiUrl}/distinctions/update`, donnees)),
            tap(() => this.setLoadingStatus(false))
        ).subscribe();
    }

    deleteDistinction(id: number): void {
        this.setLoadingStatus(true);
        this.http.delete(`${environment.apiUrl}/distinctions/delete/${id}`).pipe(
            switchMap(() => this.distinctions$),
            take(1),
            map(distinctions => distinctions.filter(distinction => distinction.id !== id)),
            tap(distinctions => {
                this._distinctions$.next(distinctions);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }
}
