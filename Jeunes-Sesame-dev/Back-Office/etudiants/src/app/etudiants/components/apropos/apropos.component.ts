import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { AproposModel, UpdateAproposModel, UpdatePasswordModel } from '../../models/apropos.model';
import { DomainesOtherModel, FilieresOtherModel, PromotionsOtherModel, RegionsOtherModel, StatusOtherModel } from '../../models/other.model';
import { AproposService } from '../../services/apropos.service';
import { OtherService } from '../../services/other.service';
import { emailValidator } from '../../Validators/email.validator';
import { svg } from './toast-svg';
declare var window: any;

@Component({
  selector: 'app-apropos',
  templateUrl: './apropos.component.html',
  styleUrls: ['./apropos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AproposComponent implements OnInit {

  loading$!: Observable<boolean>;
  apropos$!: Observable<AproposModel>;

  promotions$!: Observable<PromotionsOtherModel[]>;
  regions$!: Observable<RegionsOtherModel[]>;
  domaines$!: Observable<DomainesOtherModel[]>;
  filieres$!: Observable<FilieresOtherModel[]>;
  status$!: Observable<StatusOtherModel[]>;

  updateFormApropos!: FormGroup;
  phoneRegex: RegExp = /^03(2|3|4|8) [0-9]{2} [0-9]{3} [0-9]{2}$/;
  
  updateFormPassword!: FormGroup;
  lastpasswordCtrl!: FormControl;
  newpasswordCtrl!: FormControl;

  pdpCtrl!: FormControl;
  pdcCtrl!: FormControl;
  previewPdp!: string | null;
  previewPdc!: string | null;
  imgRegex: RegExp = /(svg|png|jpg|jpeg)/;

  updateAproposModal: any;
  updatePasswordModal: any;
  pdpModal: any;
  pdcModal: any;

  titreToast!: string;
  iconePath1!: string;
  iconePath2!: string;
  messageToast!: string;
  svglist!: {success: string[], error: string[]};

  typeInput!: string;
  checkboxLabel!: string;

  constructor(
    private aproposService: AproposService,
    private otherService: OtherService,
    private formbuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.svglist = svg;
    this.previewPdp = null;
    this.previewPdc = null;
    this.initObservable();
    this.aproposService.getApropos();
    this.otherService.getOthers();
    this.initForm();
    this.initModal();
    this.typeInput = 'password';
    this.checkboxLabel = 'afficher';
  }

  private initObservable(): void {
    this.loading$ = this.aproposService.loading$;
    this.apropos$ = this.aproposService.apropos$;

    this.promotions$ = this.otherService.promotions;
    this.regions$ = this.otherService.regions;
    this.domaines$ = this.otherService.domaines;
    this.filieres$ = this.otherService.filieres;
    this.status$ = this.otherService.status;
  }
  
  private initForm(): void {
    this.updateFormApropos = this.formbuilder.group({
      ecole: null,
      niveau_etude: null,
      tel1: null,
      tel2: null,
      email: null,
      linkedin: null,
      facebook: null,
      lien_cv: null,
      description: null,
      promotion_id: null,
      region_id: null,
      domaine_id: null,
      filiere_id: null,
      status_id: null
    });

    this.lastpasswordCtrl = this.formbuilder.control(null, Validators.required);
    this.newpasswordCtrl = this.formbuilder.control(null, [Validators.required, Validators.minLength(11)]);

    this.updateFormPassword = this.formbuilder.group({
      lastPassword: this.lastpasswordCtrl,
      newPassword: this.newpasswordCtrl
    });

    this.pdpCtrl = this.formbuilder.control(null, Validators.required);
    this.pdcCtrl = this.formbuilder.control(null, Validators.required);
  }

  private initModal(): void {
    this.updateAproposModal = new window.bootstrap.Modal("#modalModifierApropos");
    this.updatePasswordModal = new window.bootstrap.Modal('#modalChangerPassword');
    this.pdpModal = new window.bootstrap.Modal('#modalChangerPDP');
    this.pdcModal = new window.bootstrap.Modal('#modalChangerPDC');
  }

  private assignUpdateForm(donnees: AproposModel): void {
    this.updateFormApropos = this.formbuilder.group({
      ecole: [donnees.ecole, Validators.required],
      niveau_etude: [donnees.niveau_etude, Validators.required],
      tel1: [donnees.tel1, [Validators.required, Validators.pattern(this.phoneRegex)]],
      tel2: [donnees.tel2, Validators.pattern(this.phoneRegex)],
      email: [donnees.email, [Validators.required, emailValidator()]],
      linkedin: [donnees.linkedin],
      facebook: [donnees.facebook],
      lien_cv: [donnees.lien_cv],
      description: [donnees.description?.split('<br>').join('\n')],
      promotion_id: [donnees.promotion_id, Validators.required],
      region_id: [donnees.region_id, Validators.required],
      domaine_id: [donnees.domaine_id, Validators.required],
      filiere_id: [donnees.filiere_id, Validators.required],
      status_id: [donnees.status_id, Validators.required]
    });
  }

  // ========================== ERREUR MESSAGE =========================
  getCtrlError(ctlr: AbstractControl) {
    if(ctlr.hasError('minlength')) 
      return 'Veuillez entrer au minimum 11 caractères';
    else if(ctlr.hasError('emailvalidator'))
      return 'Veuillez entrer un email valide';
    else return;
  }

  // ========================== UPDATE APROPOS =================================
  onUpdateApropos(donnees: AproposModel): void {
    this.assignUpdateForm(donnees);
    this.updateAproposModal.show();
  }

  onCloseUpdateApropos(): void {
    this.updateFormApropos.reset();
    this.updateAproposModal.hide();
  }

  onSubmitApropos(): void {
    const donnees = this.updateFormApropos.value as UpdateAproposModel;
    donnees.description = donnees.description?.split('\n').join('<br>');
    if(donnees) {
      this.aproposService.updateApropos(donnees);
      this.onCloseUpdateApropos();
    }
  }

  // ========================== UPDATE PASSWORD ========================
  onUpdatePassword(): void {
    this.updatePasswordModal.show();
  }

  onCloseUpdatePassword(): void {
    this.updateFormPassword.reset();
    this.updatePasswordModal.hide();
  }

  onSubmitUpdatePassword(): void {
    let toast =  new window.bootstrap
    .Toast(document.querySelector('#toastUpdatePassword'));

    const donnees = this.updateFormPassword.value as UpdatePasswordModel;
    if(donnees) {
      this.aproposService.updatePassword(donnees).pipe(
        tap(() => {
          this.titreToast = 'Mot de passe';
          this.iconePath1 = this.svglist.success[0];
          this.iconePath2 = this.svglist.success[1];
          this.messageToast = 'Modifier avec succés!';
          toast.show();
          this.onCloseUpdatePassword();
          this.changeDetectorRef.detectChanges();
        })
      ).subscribe({
        error: response => {
          this.titreToast = 'Erreur';
          this.iconePath1 = this.svglist.error[0];
          this.iconePath2 = this.svglist.error[1];
          if(response.status === 403) {
            this.messageToast = "L'ancien mot de passe n'existe pas...";
          }
          else
            this.messageToast = `${response.error.message}: ${response.status}`;
          toast.show();
          this.changeDetectorRef.detectChanges();
        }
      });
    }
  }

  // ========================= UPDATE PDP ============================
  onUpdatePdp(): void {
    this.pdpModal.show();
  }

  onClosePdp(): void {
    this.previewPdp = null;
    this.pdpCtrl.reset();
    this.pdpModal.hide();
  }

  uploadPdp(event: any): void {
    const files = (event.target as HTMLInputElement).files;
    if(files) {      
      const type = files[0].type.split('/')[1];
      if(!type.match(this.imgRegex)) {
        this.previewPdp = null;
        this.pdpCtrl.reset();
        return; 
      }

      this.pdpCtrl.patchValue(files[0]);
      this.pdpCtrl.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewPdp = e.target.result as string;
        this.changeDetectorRef.detectChanges();
      }
      reader.readAsDataURL(files[0]);      
    }
  }

  onSubmitPdp(): void {
    const donnees = this.pdpCtrl.value;
    if(donnees) {
      this.aproposService.updatePdp(donnees);
      this.onClosePdp();
    }
    else console.log('Erreur');
  }

  // ======================== UPDATE PDC ===============================
  onUpdatePdc(): void {
    this.pdcModal.show();
  }

  onClosePdc(): void {
    this.previewPdc = null;
    this.pdcCtrl.reset();
    this.pdcModal.hide();
  }

  uploadPdc(event: any): void {
    const files = (event.target as HTMLInputElement).files;
    if(files) {
      const type = files[0].type.split('/')[1];
      if(!type.match(this.imgRegex)) {
        this.previewPdc = null;
        this.pdcCtrl.reset();
        return; 
      }

      this.pdcCtrl.patchValue(files[0]);
      this.pdcCtrl.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewPdc = e.target.result as string;
        this.changeDetectorRef.detectChanges();
      };
      reader.readAsDataURL(files[0]);
    }
  }

  onSubmitPdc(): void {
    const donnees = this.pdcCtrl.value;
    if(donnees) {
      this.aproposService.updatePdc(donnees);
      this.onClosePdc();
    }
  }

  onShowPassword(event: any): void {
    [this.typeInput, this.checkboxLabel] = event.target.checked 
      ? ['text', 'cacher'] : ['password', 'afficher']
  }
}
