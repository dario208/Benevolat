import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { CompetenceModel, CreateCompetenceModel, UpdateCompetenceModel } from "../models/competence.model";

@Injectable()
export class CompetencesService {
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

    private _competences$ = new BehaviorSubject<CompetenceModel[]>([]);
    get competences$(): Observable<CompetenceModel[]> {
        return this._competences$.asObservable();
    }

    lastCompetencesLoaded = 0;

    getCompetences(): void {
        if(Date.now() - this.lastCompetencesLoaded <= 180000) return;
        this.setLoadingStatus(true);
        this.http.get<CompetenceModel[]>(`${environment.apiUrl}/competences/etudiants`).pipe(
            tap(competences => {
                this.lastCompetencesLoaded = Date.now();
                this._competences$.next(competences);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    createComptence(donnees: CreateCompetenceModel): void {
        this.setLoadingStatus(true);
        this.http.post(`${environment.apiUrl}/competences/create`, donnees).pipe(
            switchMap(() => this.http.get<CompetenceModel[]>(`${environment.apiUrl}/competences/etudiants`)),
            take(1),
            tap(competences => {
                this._competences$.next(competences);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    updateCompetence(donnees: UpdateCompetenceModel): void {
        this.setLoadingStatus(true);
        this.competences$.pipe(
            take(1),
            map(competences => competences
                .map(competence => competence.id === donnees.id ? {
                    ...competence,
                    nom: donnees.nom_competence,
                    liste: donnees.liste,
                    description: donnees.description
                }: competence)),
                tap(competences => this._competences$.next(competences)),
                switchMap(() => this.http.put(`${environment.apiUrl}/competences/update`, donnees)),
                tap(() => this.setLoadingStatus(false))
        ).subscribe();
    }

    deleteCompetence(id: number): void {
        this.setLoadingStatus(true);
        this.http.delete(`${environment.apiUrl}/competences/delete/${id}`).pipe(
            switchMap(() => this.competences$),
            take(1),
            map(competences => competences.filter(competence => competence.id !== id)),
            tap(competences => {
                this._competences$.next(competences);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }
}
