import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { AproposModel, CreateAdminModel, UpdateAproposModel, UpdatePasswordModel } from "../models/apropos.model";

@Injectable()
export class AproposService {
    constructor(
        private http: HttpClient
    ) {}
    private _apropos!: AproposModel;

    private _loading$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
        return this._loading$.asObservable();
    }

    private setLoadingStatus(loading: boolean): void {
        this._loading$.next(loading);
    }

    private _apropos$ = new BehaviorSubject<AproposModel>(this._apropos);
    get apropos$(): Observable<AproposModel> {
        return this._apropos$.asObservable();
    }

    private _listeAdmin$ = new BehaviorSubject<AproposModel[]>([]);
    get listeAdmin$(): Observable<AproposModel[]> {
        return this._listeAdmin$.asObservable();
    }

    lastAproposLoaded = 0;
    lastAllAdminLoaded = 0;

    private ctrlImageLink(apropos: AproposModel): AproposModel {
        if(apropos.profil_path && apropos.profil_path.includes('admin_profils')) 
            apropos.profil_path = `${environment.apiUrl}${apropos.profil_path}`;
        if(!apropos.profil_path) apropos.profil_path = `${environment.apiUrl}/admin_profils/user.png`;
        return apropos;
    }

    getApropos(): void {
        if(Date.now() - this.lastAproposLoaded <= 300000) return;
        this.setLoadingStatus(true);
        this.http.get<AproposModel>(`${environment.apiUrl}/administrateurs/find`).pipe(
            map(apropos => this.ctrlImageLink(apropos)),
            tap(apropos => {
                this.lastAproposLoaded = Date.now();
                this._apropos$.next(apropos);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    getAllAdmin(): void {
        if(Date.now() - this.lastAllAdminLoaded <= 300000) return;
        this.setLoadingStatus(true);
        this.http.get<AproposModel[]>(`${environment.apiUrl}/administrateurs/all`).pipe(
            map(response => response.map(value => this.ctrlImageLink(value))),
            tap(response => {
                this.lastAllAdminLoaded = Date.now();
                this._listeAdmin$.next(response);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    createAdmin(donnees: CreateAdminModel): void {
        this.setLoadingStatus(true),
        this.http.post(`${environment.apiUrl}/administrateurs/create`, donnees).pipe(
            switchMap(() => this.http.get<AproposModel[]>(`${environment.apiUrl}/administrateurs/all`)),
            take(1),
            map(response => response.map(value => this.ctrlImageLink(value))),
            tap(response => {
                this._listeAdmin$.next(response);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    updateApropos(donnees: UpdateAproposModel): void {
        this.setLoadingStatus(true);
        this.http.patch(`${environment.apiUrl}/administrateurs/update`, donnees).pipe(
            switchMap(() => this.http.get<AproposModel>(`${environment.apiUrl}/administrateurs/find`)),
            take(1),
            map(apropos => this.ctrlImageLink(apropos)),
            tap(apropos => {
                this._apropos$.next(apropos);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    updatePassword(donnees: UpdatePasswordModel): Observable<any> {
        return this.http.patch(`${environment.apiUrl}/administrateurs/update-password`, 
            donnees,
            {observe: 'body'}
        );
    }

    updatePdp(donnees: any): void {
        this.setLoadingStatus(true);
        const formdata = new FormData();
        formdata.set('filepdp', donnees);
        this.http.patch(`${environment.apiUrl}/administrateurs/update-profil`, formdata).pipe(
            switchMap(() => this.http.get<AproposModel>(`${environment.apiUrl}/administrateurs/find`)),
            take(1),
            map(apropos => this.ctrlImageLink(apropos)),
            tap(apropos => {
                this._apropos$.next(apropos);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }
}