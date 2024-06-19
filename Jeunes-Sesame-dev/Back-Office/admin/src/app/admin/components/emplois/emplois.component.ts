import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { CategorieModel, CreateEmploisModel, DomaineModel, EmploisModel, StatusModel, UpdateEmploisModel } from '../../models/emplois.model';
import { EmploisService } from '../../services/emplois.service';
declare var window: any;

@Component({
  selector: 'app-emplois',
  templateUrl: './emplois.component.html',
  styleUrls: ['./emplois.component.scss']
})
export class EmploisComponent implements OnInit {
  loading$!: Observable<boolean>;
  emplois$!:Observable<EmploisModel[]>;
  categorie$!: Observable<CategorieModel[]>;
  domaine$!: Observable<DomaineModel[]>;
  status$!: Observable<StatusModel[]>;

  nomSearchCtrl!: FormControl;
  categorieSearchCtrl!: FormControl;

  createForm!: FormGroup;
  categorieCreateArray!: FormArray;
  domaineCreateArray!: FormArray;
  statusCreateArray!: FormArray;
  createModal: any;

  updateForm!: FormGroup;
  categorieUpdateArray!: FormArray;
  updateModal: any;

  currentEmploi!: EmploisModel | null;
  deleteModal: any;

  displayModal: any;

  constructor(
    private emploisService: EmploisService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFormSearchCtrl();
    this.initFormGroup();
    this.initObservables();
    this.emploisService.getEmplois();
    this.emploisService.getCombineall();
    this.initModal();
    this.currentEmploi = null;
  }

  private initFormSearchCtrl(): void {
    this.nomSearchCtrl = this.formbuilder.control('');
    this.categorieSearchCtrl = this.formbuilder.control('');
  }

  private initObservables(): void {
    this.loading$ = this.emploisService.loading$;

    const nom$: Observable<string> = this.nomSearchCtrl.valueChanges.pipe(
      startWith(this.nomSearchCtrl.value as string),
      map((value: string) => value.toLowerCase())
    );

    const categorie$: Observable<string> = this.categorieSearchCtrl.valueChanges.pipe(
      startWith(this.categorieSearchCtrl.value as string),
      map((value: string) => value.toLowerCase())
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

    this.categorie$ = this.emploisService.categorie$;
    this.domaine$ = this.emploisService.domaine$;
    this.status$ = this.emploisService.status$;
  }

  private initFormGroup(): void {
    this.categorieCreateArray = this.formbuilder.array([], Validators.required);
    this.domaineCreateArray = this.formbuilder.array([]);
    this.statusCreateArray = this.formbuilder.array([]);
    this.createForm = this.formbuilder.group({
      nom_emploi: [null, Validators.required],
      description: [null, Validators.required],
      categorie_id: this.categorieCreateArray,
      domaine_id: this.domaineCreateArray,
      status_id: this.statusCreateArray
    });

    this.categorieUpdateArray = this.formbuilder.array([]);
    this.updateForm = this.formbuilder.group({
      id: null, 
      nom_emploi: null, 
      description: null, 
      categorie_id: this.categorieUpdateArray
    });
  }

  private assignUpdateForm(donnees: EmploisModel): void {

    this.categorieUpdateArray = this.formbuilder.array([], Validators.required);
    this.updateForm = this.formbuilder.group({
      id: [donnees.id, Validators.required],
      nom_emploi: [donnees.nom_emploi, Validators.required],
      description: [donnees.description.split('</br>').join('\n'), Validators.required],
      categorie_id: this.categorieUpdateArray
    });
  }

  private initModal(): void {
    this.createModal = new window.bootstrap.Modal('#modalCreateEmplois');
    this.updateModal = new window.bootstrap.Modal('#modalModifierEmplois');
    this.deleteModal = new window.bootstrap.Modal('#modalSupprimerEmplois');
    this.displayModal = new window.bootstrap.Modal('#modalDisplayEmplois');
  }

  private reinitCheckboxes(selecteur: string): void {
    const elements = <NodeListOf<HTMLInputElement>>document.querySelectorAll(`${selecteur}`);
    elements.forEach(element => {
      element.checked = false;
    });
  }

  // =============== SHOW DETAIL =============
  listenStatusDisplayerModal(donnees: EmploisModel): void {
    this.currentEmploi = donnees;
    this.displayModal.show();
  }

  oncloseDisplay(): void {
    this.currentEmploi = null;
    this.displayModal.hide();
  }

  // ================ CREATE =================
  listenStatusCreateModal(): void {
    this.createModal.show();
  }

  onCloseCreate(): void {
    this.createForm.reset();
    this.createModal.hide();
    this.reinitCheckboxes("#modalCreateEmplois input[type='checkbox']");
  }

  onChangeCategorieCreate(event: any): void {
    const select = this.categorieCreateArray as FormArray;
    if(event.target.checked) {
      select.push(new FormControl(event.target.value));
    }
    else {
      const index = select.controls
        .findIndex(item => item.value === event.target.value);
      select.removeAt(index);
    }    
  }

  onChangeDomaineCreate(event: any): void {
    const select = this.domaineCreateArray as FormArray;
    if(event.target.checked) {
      select.push(new FormControl(event.target.value));
    }
    else {
      const index = select.controls
        .findIndex(item => item.value === event.target.value);
      select.removeAt(index);
    }
  }

  onChangeStatusCreate(event: any): void {
    const select = this.statusCreateArray as FormArray;
    if(event.target.checked) {
      select.push(new FormControl(event.target.value));
    }
    else {
      const index = select.controls
        .findIndex(item => item.value === event.target.value);
      select.removeAt(index);
    }
  }

  onSubmitCreate(): void {
    const donnees = this.createForm.value as CreateEmploisModel;
    donnees.description = donnees.description.split('\n').join('</br>');
    if(!donnees) return;
    this.emploisService.createEmploi(donnees);
    this.onCloseCreate();
  }

  // ====================== UPDATE ======================
  listenStatusUpdateModal(donnees: EmploisModel): void {
    this.assignUpdateForm(donnees);
    this.updateModal.show();
  }

  onCloseUpdate(): void {
    this.updateForm.reset();
    this.updateModal.hide();
    this.reinitCheckboxes("#modalModifierEmplois input[type='checkbox']");
  }

  onChangeCategorieUpdate(event: any): void {
    const select = this.categorieUpdateArray as FormArray;
    if(event.target.checked) {
      select.push(new FormControl(event.target.value));
    }
    else {
      const index = select.controls
        .findIndex(item => item.value === event.target.value);
      select.removeAt(index);
    }  
  }

  onSubmitUpdate(): void {
    const donnees = this.updateForm.value as UpdateEmploisModel;
    donnees.description = donnees.description.split('\n').join('</br>');
    if(!donnees) return;
    this.emploisService.updateEmplois(donnees);
    this.onCloseUpdate();
  }

  // ===================== DELETE =======================
  listenStatusDeleteModal(donnees: EmploisModel): void {
    this.currentEmploi = donnees;
    this.deleteModal.show();
  }

  onCloseDelete(): void {
    this.currentEmploi = null;
    this.deleteModal.hide();
  }

  onConfirmDelete(): void {
    const donnees = this.currentEmploi as EmploisModel;
    if(!donnees) return;
    this.emploisService.deleteEmplois(donnees.id);
    this.onCloseDelete();
  }
}
