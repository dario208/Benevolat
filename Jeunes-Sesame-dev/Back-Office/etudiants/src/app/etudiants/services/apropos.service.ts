import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap, take, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { AproposModel, UpdateAproposModel, UpdatePasswordModel } from "../models/apropos.model";

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

    private setLoadingStatus(loading: boolean) {
        this._loading$.next(loading);
    }

    private _apropos$ = new BehaviorSubject<AproposModel>(this._apropos);
    get apropos$(): Observable<AproposModel> {
        return this._apropos$.asObservable();
    }
    
    lastAproposLoaded = 0;

    private ctrlImageLink(apropos: AproposModel): AproposModel {            
        if(!apropos.pdp) apropos.pdp = `${environment.apiUrl}/etudiants_pdp/user.png`;
        if(!apropos.pdc) apropos.pdc = `${environment.apiUrl}/etudiants_pdc/user.png`;
        return apropos;
    }

    getApropos(): void {
        if(Date.now() - this.lastAproposLoaded <= 180000) return;
        this.setLoadingStatus(true);
        this.http.get<AproposModel>(`${environment.apiUrl}/etudiants`).pipe(
            map(apropos => this.ctrlImageLink(apropos)),
            tap(apropos => {
                this.lastAproposLoaded = Date.now();
                this._apropos$.next(apropos);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    updateApropos(donnees: UpdateAproposModel): void {
        this.setLoadingStatus(true);
        this.http.put(`${environment.apiUrl}/etudiants/update`, donnees).pipe(
            switchMap(() => this.http.get<AproposModel>(`${environment.apiUrl}/etudiants`)),
            map(apropos => this.ctrlImageLink(apropos)),
            take(1),
            tap(apropos => {
                this._apropos$.next(apropos);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    updatePassword(donnees: UpdatePasswordModel): Observable<any> {
        return this.http.patch(`${environment.apiUrl}/etudiants/update-password`, 
            donnees, 
            { observe: 'body'}
        );
    }

    updatePdp(donnees: any): void {
        this.setLoadingStatus(true);
        const formdata = new FormData();
        formdata.set('filepdp', donnees);
        this.http.patch(`${environment.apiUrl}/etudiants/update-pdp`, formdata).pipe(
            switchMap(() => this.http.get<AproposModel>(`${environment.apiUrl}/etudiants`)),
            map(apropos => this.ctrlImageLink(apropos)),
            take(1),
            tap(apropos => {
                this._apropos$.next(apropos);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }

    updatePdc(donnees: any): void {
        this.setLoadingStatus(true);
        const formdata = new FormData();
        formdata.set('filepdc', donnees);
        this.http.patch(`${environment.apiUrl}/etudiants/update-pdc`, formdata).pipe(
            switchMap(() => this.http.get<AproposModel>(`${environment.apiUrl}/etudiants`)),
            map(apropos => this.ctrlImageLink(apropos)),
            take(1),
            tap(apropos => {
                this._apropos$.next(apropos);
                this.setLoadingStatus(false);
            })
        ).subscribe();
    }
}
