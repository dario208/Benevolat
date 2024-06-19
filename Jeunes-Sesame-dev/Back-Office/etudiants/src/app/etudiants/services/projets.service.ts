import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { CreateProjetModel, ProjetModel, UpdateProjetModel } from "../models/projet.model";

@Injectable()
export class ProjectsService {
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
    
    private _projets$ = new BehaviorSubject<ProjetModel[]>([]);
    get projets$(): Observable<ProjetModel[]> {
        return this._projets$.asObservable();
    }

    lastProjetsLoaded = 0;

    getProjets(): void {
        if(Date.now() - this.lastProjetsLoaded <= 180000) return;
        this.setLoadingStatus(true);
        this.http.get<ProjetModel[]>(`${environment.apiUrl}/projets/etudiants`).pipe(
            tap(projets => {
                this.lastProjetsLoaded = Date.now();
                this._projets$.next(projets);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    createProjet(donnees: CreateProjetModel): void {
        this.setLoadingStatus(true);
        this.http.post(`${environment.apiUrl}/projets/create`, donnees).pipe(
            switchMap(() => this.http.get<ProjetModel[]>(`${environment.apiUrl}/projets/etudiants`)),
            take(1),
            tap(projets => {
                this._projets$.next(projets);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    updateProjet(donnees: UpdateProjetModel): void {
        this.setLoadingStatus(true);
        this.projets$.pipe(
            take(1),
            map(projets => projets
                .map(projet => projet.id === donnees.id ? {
                    ...projet,
                    nom: donnees.nom,
                    description: donnees.description,
                    lien: donnees.lien,
                    img: donnees.img 
                }: projet)),
            tap(projets => this._projets$.next(projets)),
            switchMap(() => this.http.put(`${environment.apiUrl}/projets/update`, donnees)),
            tap(() => this.setLoadingStatus(false))
        ).subscribe();
    }

    deleteProjet(id: number): void {
        this.setLoadingStatus(true);
        this.http.delete(`${environment.apiUrl}/projets/delete/${id}`).pipe(
            switchMap(() => this.projets$),
            take(1),
            map(projets => projets.filter(projet => projet.id !== id)),
            tap(projets => {
                this._projets$.next(projets);
                this.setLoadingStatus(true);
            })
        ).subscribe();
    }
}
