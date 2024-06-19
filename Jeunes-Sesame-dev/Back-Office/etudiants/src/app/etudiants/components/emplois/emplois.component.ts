import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { EmploisModel } from '../../models/emplois.model';
import { EmploisService } from '../../services/emplois.service';
declare var window: any;

@Component({
  selector: 'app-emplois',
  templateUrl: './emplois.component.html',
  styleUrls: ['./emplois.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmploisComponent implements OnInit {
  emplois$!: Observable<EmploisModel[]>;
  nomSearchCtrl!: FormControl;
  categorieSearchCtrl!: FormControl;
  currentEmploi!: EmploisModel | null;
  displayModal: any;

  constructor(
    private emploisService: EmploisService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFormCtrl();
    this.emploisService.getEmplois();
    this.initObservable();
    this.currentEmploi = null;
    this.initModal();
  }

  private initFormCtrl(): void {
    this.nomSearchCtrl = this.formbuilder.control('');
    this.categorieSearchCtrl = this.formbuilder.control('');
  }

  private initObservable(): void {
    const nom$ = this.nomSearchCtrl.valueChanges.pipe(
      startWith(this.nomSearchCtrl.value as string),
      map((response: string) => response.toLowerCase())
    );

    const categorie$ = this.categorieSearchCtrl.valueChanges.pipe(
      startWith(this.nomSearchCtrl.value as string),
      map((response: string) => response.toLowerCase())
    );

    this.emplois$ = combineLatest([
      nom$, categorie$, this.emploisService.emplois$
    ]).pipe(
      map(([nom, categorie, emplois]) => emplois
        .filter(value => 
          value.nom_emploi.toLowerCase().includes(nom) &&
          value.categorie_emplois.toLowerCase().includes(categorie))
      )
    );
  }

  private initModal(): void {
    this.displayModal = new window.bootstrap.Modal('#modalDisplayEmplois');
  }

  listenStatusDisplayerModal(donnees: EmploisModel): void {
    this.currentEmploi = donnees;
    this.displayModal.show();
  }

  oncloseDisplay(): void {
    this.currentEmploi = null;
    this.displayModal.hide();
  }
}
