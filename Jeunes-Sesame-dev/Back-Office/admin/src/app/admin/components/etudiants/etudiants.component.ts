import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { PromotionsModel } from '../../models/accueil.model';
import { CreateEtudiantModel, DomaineCompetencesModel, EtudiantsModel, 
  FilieresModel, StatusProModel, UpdateEtudiantModel } from '../../models/etudiants.model';
import { EtudiantsService } from '../../services/etudiants.service';
import { emailValidator } from '../../validators/email.validator';
declare var window: any;

@Component({
  selector: 'app-etudiants',
  templateUrl: './etudiants.component.html',
  styleUrls: ['./etudiants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EtudiantsComponent implements OnInit {
  loading$!: Observable<boolean>;
  etudiants$!: Observable<EtudiantsModel[]>;
  statuspro$!: Observable<StatusProModel[]>;
  domaines$!: Observable<DomaineCompetencesModel[]>;
  promotions$!: Observable<PromotionsModel[]>;
  filieres$!: Observable<FilieresModel[]>;

  statusCtrl!: FormControl;
  domaineCtrl!: FormControl;
  promotionCtrl!: FormControl;
  filiereCtrl!: FormControl;
  nomCtrl!: FormControl;

  createForm!: FormGroup;
  emailCtrl!: FormControl;
  createModal: any;

  updateForm!: FormGroup;
  emailUpdateCtrl!: FormControl;
  updateModal: any;

  currentEtudiant!: EtudiantsModel | null;
  deleteModal: any;

  constructor(
    private etudiantsService: EtudiantsService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFormCtrl();
    this.initObservable();
    this.etudiantsService.getEtudiants();
    this.etudiantsService.getFilterall();
    this.initFormGroup();
    this.initModal();
    this.currentEtudiant = null;
  }

  private initObservable(): void {
    this.loading$ = this.etudiantsService.loading$;

    this.statuspro$ = this.etudiantsService.statuspro$;
    this.domaines$ = this.etudiantsService.domaines$;
    this.promotions$ = this.etudiantsService.promotions$;
    this.filieres$ = this.etudiantsService.filieres$;

    const status$ = this.statusCtrl.valueChanges.pipe(
      startWith(this.statusCtrl.value),
      map((response: string) => response.toLowerCase().trim())
    );

    const domaine$ = this.domaineCtrl.valueChanges.pipe(
      startWith(this.domaineCtrl.value),
      map((response: string) => response.toLowerCase().trim())
    );

    const promotion$ = this.promotionCtrl.valueChanges.pipe(
      startWith(this.promotionCtrl.value),
      map((response: string) => response.toLowerCase().trim())
    );

    const filiere$ = this.filiereCtrl.valueChanges.pipe(
      startWith(this.filiereCtrl.value),
      map((response: string) => response.toLowerCase().trim())
    );

    const nom$ = this.nomCtrl.valueChanges.pipe(
      startWith(this.nomCtrl.value),
      map((response: string) => response.toLowerCase().trim())
    );

    this.etudiants$ = combineLatest([
      status$, domaine$, promotion$, filiere$, nom$, this.etudiantsService.etudiants$
    ]).pipe(
      map(([status, domaine, promotion, filiere, nom, etudiants]) => etudiants
        .filter(etudiant => (
          etudiant.status_professionnel.toLowerCase().includes(status) && 
          etudiant.nom_domaine.toLowerCase().includes(domaine) &&
          etudiant.promotion.toString().toLowerCase().includes(promotion) &&
          etudiant.nom_filiere.toLowerCase().includes(filiere) &&
          `${etudiant.nom} ${etudiant.prenoms}`.toLowerCase().includes(nom)
          )))
    );
  }

  private initFormCtrl(): void {
    this.statusCtrl = this.formbuilder.control('');
    this.domaineCtrl = this.formbuilder.control('');
    this.promotionCtrl = this.formbuilder.control('');
    this.filiereCtrl = this.formbuilder.control('');
    this.nomCtrl = this.formbuilder.control('');
  }

  private initFormGroup(): void {
    this.emailCtrl = this.formbuilder.control('', [Validators.required, emailValidator()]);
    this.createForm = this.formbuilder.group({
      nom: [null, Validators.required],
      prenoms: [null, Validators.required],
      email: this.emailCtrl
    });

    this.emailUpdateCtrl = this.formbuilder.control('', emailValidator());
    this.updateForm = this.formbuilder.group({
      id: null, nom: null, prenoms: null, email: null
    });
  }

  private initModal(): void {
    this.createModal = new window.bootstrap.Modal('#modalCreateEtudiants');
    this.updateModal = new window.bootstrap.Modal('#modalModifierEtudiants');
    this.deleteModal = new window.bootstrap.Modal('#modalSupprimerEtudiants');
  }

  onResetFilter(): void {
    this.statusCtrl.setValue('');
    this.domaineCtrl.setValue('');
    this.promotionCtrl.setValue('');
    this.filiereCtrl.setValue('');
    this.nomCtrl.setValue('');
  }

  getErrorCtrl(ctlr: AbstractControl): string | undefined {
    if(ctlr.hasError('emailvalidator')) 
      return 'Veuillez entrer un email valide!';
    else return;
  }

  private assignUpdateForm(donnees: EtudiantsModel): void {
    this.emailUpdateCtrl = this.formbuilder.control(donnees.email, emailValidator());
    this.updateForm = this.formbuilder.group({
      id: [donnees.id, Validators.required],
      nom: [donnees.nom, Validators.required],
      prenoms: [donnees.prenoms, Validators.required],
      email: this.emailUpdateCtrl
    });
  }

  // ================== CREATE ===================
  listenStatusCreateModal(): void {
    this.createModal.show();
  }

  onCloseCreate(): void {
    this.createForm.reset();
    this.createModal.hide();
  }

  onSubmitCreate(): void {
    const donnees = this.createForm.value as CreateEtudiantModel;
    if(!donnees) return;
    this.etudiantsService.createEtudiant(donnees);
    this.onCloseCreate();
  }

  // ================= UPDATE ====================
  onUpdate(donnees: EtudiantsModel): void {
    this.assignUpdateForm(donnees);
    this.updateModal.show();
  }

  onCloseUpdate(): void {
    this.updateForm.reset();
    this.updateModal.hide();
  }

  onSubmitUpdate(): void {
    const donnees = this.updateForm.value as UpdateEtudiantModel;
    if(!donnees) return;
    this.etudiantsService.updateEtudiant(donnees);
    this.onCloseUpdate();    
  }

  // ================== DELETE ====================
  onRemove(donnees: EtudiantsModel): void {
    this.currentEtudiant = donnees;
    this.deleteModal.show();
  }

  onCloseDelete(): void {
    this.currentEtudiant = null;
    this.deleteModal.hide();
  }

  onConfirmDelete(): void {
    const donnees = this.currentEtudiant as EtudiantsModel;
    if(!donnees) return;
    this.etudiantsService.deleteEtudiant(donnees.id);
    this.onCloseDelete();    
  }
}
