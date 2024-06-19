import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map, Observable, switchMap, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { CreateEtudiantModel, DomaineCompetencesModel, EtudiantsModel, FilieresModel, PromotionsModel, StatusProModel, UpdateEtudiantModel } from "../models/etudiants.model";

@Injectable()
export class EtudiantsService {
    constructor(
        private http: HttpClient
    ) {}

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    private setLoading(loading: boolean): void {
        this._loading$.next(loading);
    }

    private _etudiants$ = new BehaviorSubject<EtudiantsModel[]>([]);
    get etudiants$(): Observable<EtudiantsModel[]> {
        return this._etudiants$.asObservable();
    }

    private _statuspro$ = new BehaviorSubject<StatusProModel[]>([]);
    get statuspro$(): Observable<StatusProModel[]> {
        return this._statuspro$.asObservable();
    }

    private _domaines$ = new BehaviorSubject<DomaineCompetencesModel[]>([]);
    get domaines$(): Observable<DomaineCompetencesModel[]> {
        return this._domaines$.asObservable();
    }

    private _promotions$ = new BehaviorSubject<PromotionsModel[]>([]);
    get promotions$(): Observable<PromotionsModel[]> {
        return this._promotions$.asObservable();
    }

    private _filieres$ = new BehaviorSubject<FilieresModel[]>([]);
    get filieres$(): Observable<FilieresModel[]> {
        return this._filieres$.asObservable();
    }

    lastLoadedEtudiants = 0;
    lastLoadedFilter = 0;

    private ctrlImageLink(donnees: EtudiantsModel): EtudiantsModel {
        if(!donnees.pdp) donnees.pdp = `${environment.apiUrl}/etudiants_pdp/user.png`;
        if(!donnees.pdc) donnees.pdc = `${environment.apiUrl}/etudiants_pdc/user.png`;
        return donnees;
    }

    private changeNull(donnees: EtudiantsModel): EtudiantsModel {
        if(!donnees.status_professionnel) donnees.status_professionnel = '';
        if(!donnees.nom_domaine) donnees.nom_domaine = '';
        if(!donnees.nom_filiere) donnees.nom_filiere = '';
        if(!donnees.promotion) donnees.promotion = '';
        return donnees;
    }

    getEtudiants(): void {
        if(Date.now() - this.lastLoadedEtudiants <= 180000) return;
        this.setLoading(true);
        this.http.get<EtudiantsModel[]>(`${environment.apiUrl}/etudiants/find-all`).pipe(
            map(response => response.map(value => this.ctrlImageLink(value))),
            map(response => response.map(value => this.changeNull(value))),
            tap(response => {
                this.lastLoadedEtudiants = Date.now();
                this._etudiants$.next(response);
                this.setLoading(false);
            })
        ).subscribe();
    }

    getFilterall(): void {
        if(Date.now() - this.lastLoadedFilter <= 180000) return;
        this.setLoading(true);
        combineLatest([
            this.http.get<StatusProModel[]>(`${environment.apiUrl}/status-professionnels/all`),
            this.http.get<DomaineCompetencesModel[]>(`${environment.apiUrl}/domaine-competences/all`),
            this.http.get<PromotionsModel[]>(`${environment.apiUrl}/promotions/all`),
            this.http.get<FilieresModel[]>(`${environment.apiUrl}/filieres/all`)
        ]).pipe(
            tap(([statuspro, domaines, promotions, filieres]) => {
                this.lastLoadedFilter = Date.now();
                this._statuspro$.next(statuspro);
                this._domaines$.next(domaines);
                this._promotions$.next(promotions);
                this._filieres$.next(filieres);
                this.setLoading(false);
            })
        ).subscribe();
    }

    createEtudiant(donnees: CreateEtudiantModel): void {
        this.setLoading(true);
        this.http.post(`${environment.apiUrl}/etudiants/create`, donnees).pipe(
            switchMap(() => this.http.get<EtudiantsModel[]>(`${environment.apiUrl}/etudiants/find-all`)),
            take(1),
            map(response => response.map(value => this.ctrlImageLink(value))),
            map(response => response.map(value => this.changeNull(value))),
            tap(response => {
                this._etudiants$.next(response);
                this.setLoading(false);
            })
        ).subscribe();
    }

    updateEtudiant(donnees: UpdateEtudiantModel): void {
        this.setLoading(true);
        this.etudiants$.pipe(
            take(1),
            map(response => response.map(value => value.id === donnees.id ? {
                ...value,
                nom: donnees.nom,
                prenoms: donnees.prenoms,
                email: donnees.email
            }: value)),
            tap(response => this._etudiants$.next(response)),
            switchMap(() => this.http.patch(`${environment.apiUrl}/etudiants/update-nom`, donnees)),
            tap(() => this.setLoading(false))
        ).subscribe();
    }

    deleteEtudiant(id: number): void {
        this.setLoading(true);
        this.http.delete(`${environment.apiUrl}/etudiants/delete/${id}`).pipe(
            switchMap(() => this.etudiants$),
            take(1),
            map(response => response.filter(value => value.id !== id)),
            tap(response => {
                this._etudiants$.next(response);
                this.setLoading(false);
            })
        ).subscribe();
    }
}
