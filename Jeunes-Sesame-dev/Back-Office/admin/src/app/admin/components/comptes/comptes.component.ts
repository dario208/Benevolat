import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { AproposModel, CreateAdminModel, UpdateAproposModel, UpdatePasswordModel } from '../../models/apropos.model';
import { AproposService } from '../../services/apropos.service';
import { emailValidator } from '../../validators/email.validator';
import { svg } from './toast-svg';
declare var window: any;

@Component({
  selector: 'app-comptes',
  templateUrl: './comptes.component.html',
  styleUrls: ['./comptes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComptesComponent implements OnInit {
  loading$!: Observable<boolean>;
  apropos$!: Observable<AproposModel>;
  listeAdmin$!: Observable<AproposModel[]>;

  createForm!: FormGroup;
  emailCtrl!: FormControl;
  createModal: any;

  updateForm!: FormGroup;
  emailUpdateCtrl!: FormControl;
  updateModal: any;

  updatePasswordForm!: FormGroup;
  lastPasswordCtrl!: FormControl;
  newPasswordCtrl!: FormControl;
  updatePasswordModal: any;
  typeInput!: string;
  checkboxLabel!: string;

  titreToast!: string;
  iconePath1!: string;
  iconePath2!: string;
  messageToast!: string;
  svglist!: {success: string[], error: string[]};

  pdpCtrl!: FormControl;
  previewPdp!: string | null;
  imgRegex: RegExp = /(svg|png|jpg|jpeg)/;
  pdpModal: any;

  constructor(
    private aproposService: AproposService,
    private formbuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initObservable();
    this.aproposService.getApropos();
    this.aproposService.getAllAdmin();
    this.initForm();
    this.initModal();
    this.typeInput = 'password';
    this.checkboxLabel = 'afficher';
    this.svglist = svg;
    this.previewPdp = null; 
  }

  private initObservable(): void {
    this.loading$ = this.aproposService.loading$;
    this.apropos$ = this.aproposService.apropos$;
    this.listeAdmin$ = this.aproposService.listeAdmin$;
  }

  private initForm(): void {
    this.emailCtrl = this.formbuilder.control('', emailValidator())
    this.createForm = this.formbuilder.group({
      nom: [null, Validators.required],
      prenoms: [null, Validators.required],
      email: this.emailCtrl
    });

    this.emailUpdateCtrl = this.formbuilder.control('', emailValidator());
    this.updateForm = this.formbuilder.group({
      email: null, description: null
    });

    this.lastPasswordCtrl = this.formbuilder.control('', Validators.required);
    this.newPasswordCtrl = this.formbuilder.control('', [Validators.required, Validators.minLength(11)]);
    this.updatePasswordForm = this.formbuilder.group({
      lastPassword: this.lastPasswordCtrl,
      newPassword: this.newPasswordCtrl
    });

    this.pdpCtrl = this.formbuilder.control(null, Validators.required);
  }

  private initModal(): void {
    this.createModal = new window.bootstrap.Modal('#modalCreateAdmin');
    this.updateModal = new window.bootstrap.Modal('#modalModifierAdmin');
    this.updatePasswordModal = new window.bootstrap.Modal('#modalModifierAdminPassword');
    this.pdpModal = new window.bootstrap.Modal('#modalChangerPDP');
  }

  getErrorCtrl(ctlr: AbstractControl) {
    if(ctlr.hasError('emailvalidator')) 
      return 'Veuillez entrer un email valide!';
    else if(ctlr.hasError('minlength'))
      return 'Veuillez entrer au minimum 11 caractères';
    else return;
  }

  private assignUpdateForm(donnees: AproposModel): void {
    this.emailUpdateCtrl = this.formbuilder.control(donnees.email, emailValidator());
    this.updateForm = this.formbuilder.group({
      email: this.emailUpdateCtrl,
      description: [donnees.description?.split('</br>').join('\n')]
    });
  }

  // =============== CREATE ================
  onCreateAdmin(): void {
    this.createModal.show();
  }

  onCloseCreate(): void {
    this.createForm.reset();
    this.createModal.hide();
  }

  onSubmitCreate(): void {
    const donnees =  this.createForm.value as CreateAdminModel;
    if(!donnees) return;
    this.aproposService.createAdmin(donnees);
    this.createModal.hide();    
  }

  // ================== UPDATE ====================
  onUpdateAdmin(donnees: AproposModel): void {
    this.assignUpdateForm(donnees);
    this.updateModal.show();
  }

  onCloseUpdate(): void {
    this.updateForm.reset();
    this.updateModal.hide();
  }

  onSubmitUpdate(): void {
    const donnees = this.updateForm.value as UpdateAproposModel;
    donnees.description = donnees.description.split('\n').join('</br>');
    if(!donnees) return;    
    this.aproposService.updateApropos(donnees);
    this.onCloseUpdate();    
  }

  // =============== UPDATE PASSWORD =================
  onUpdatePassword(): void {
    this.updatePasswordModal.show();
  }

  onShowPassword(event: any): void {
    [this.typeInput, this.checkboxLabel] = event.target.checked 
      ? ['text', 'cacher'] : ['password', 'afficher']
  }

  onCloseUpdatePassword(): void {
    this.updatePasswordForm.reset();
    this.updatePasswordModal.hide();
  }

  onSubmitUpdatePassword(): void {
    let toast =  new window.bootstrap
      .Toast(document.querySelector('#toastUpdatePassword'));
    const donnees = this.updatePasswordForm.value as UpdatePasswordModel;
    if(!donnees) return;
    this.aproposService.updatePassword(donnees).pipe(
      tap(() => {
        this.titreToast = 'Mot de passe';
        this.iconePath1 = this.svglist.success[0];
        this.iconePath2 = this.svglist.success[1];
        this.messageToast = 'Modifier avec succés!';
        toast.show();
        this.onCloseUpdatePassword();
        this.changeDetectorRef.detectChanges();
      }),
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

  // ================ UPDATE CHANGE PDP =================
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
    if(!files) return;
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

  onSubmitPdp(): void {
    const donnees = this.pdpCtrl.value;
    if(!donnees) return;
    this.aproposService.updatePdp(donnees);
    this.onClosePdp();
  }
}
