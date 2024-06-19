import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { CreateFormationModel, FormationModel, UpdateFormationModel } from "../models/formation.model";

@Injectable()
export class FormationsService {
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

    private _formations$ = new BehaviorSubject<FormationModel[]>([]);
    get formations$(): Observable<FormationModel[]> {
        return this._formations$.asObservable();
    }

    lastFormationsLoaded = 0;

    getFormations(): void {
        if(Date.now() - this.lastFormationsLoaded <= 300000) return;
        this.setLoadingStatus(true);
        this.http.get<FormationModel[]>(`${environment.apiUrl}/formations/etudiants`).pipe(
            tap(formations => {
                this.lastFormationsLoaded = Date.now();
                this._formations$.next(formations);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    createFormation(donnees: CreateFormationModel): void {
        this.setLoadingStatus(true);
        this.http.post(`${environment.apiUrl}/formations/create`, donnees).pipe(
            switchMap(() => this.http.get<FormationModel[]>(`${environment.apiUrl}/formations/etudiants`)),
            take(1),
            tap(formations => {
                this._formations$.next(formations);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    updateFormation(donnees: UpdateFormationModel): void {
        this.setLoadingStatus(true),
        this.formations$.pipe(
            take(1),
            map(formations => formations
                .map(formation => formation.id === donnees.id ? {
                    ...formation, 
                    nom: donnees.nom_formation,
                    lieu_formation: donnees.lieu,
                    annee: donnees.annee,
                    description: donnees.description
                }: formation)),
            tap(formations => this._formations$.next(formations)),
            switchMap(() => this.http.put(`${environment.apiUrl}/formations/update`, donnees)),
            tap(() => this.setLoadingStatus(false))
        ).subscribe();
    }

    deleteFormation(id: number): void {
        this.setLoadingStatus(true);
        this.http.delete(`${environment.apiUrl}/formations/delete/${id}`).pipe(
            switchMap(() => this.formations$),
            take(1),
            map(formations => formations.filter(formation => formation.id !== id)),
            tap(formations => {
                this._formations$.next(formations);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }
}
