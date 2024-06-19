import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CreateProjetModel, ProjetModel, UpdateProjetModel } from '../../models/projet.model';
import { ProjectsService } from '../../services/projets.service';
declare var window: any;

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjetsComponent implements OnInit {

  loading$!: Observable<boolean>;
  projets$!: Observable<ProjetModel[]>;
  updateModal: any;
  updateForm!: FormGroup;
  deleteModal: any;
  currentProjet!: ProjetModel | null;
  createModal: any;
  createForm!: FormGroup;

  constructor(
    private projetsService: ProjectsService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.dragScroll('.card_group');
    this.initObservables();
    this.projetsService.getProjets();
    this.initForm();
    this.currentProjet = null;
    this.initModal();
  }

  private initObservables(): void {
    this.loading$ = this.projetsService.loading$;
    this.projets$ = this.projetsService.projets$;
  }

  private dragScroll(element: string) {
    const slider = <HTMLElement>document.querySelector(`${element}`);
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      e.stopPropagation();
      slider.classList.add('active_card');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.classList.remove('active_card');
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
    });

    slider.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    });
  }

  private initForm(): void {
    this.createForm = this.formbuilder.group({
      nom: [null, Validators.required],
      description: [null, Validators.required],
      lien: null,
      img: null,
    });

    this.updateForm = this.formbuilder.group({
      id: null, nom: null, lien: null, img: null, description: null
    });
  }

  private initModal() : void {
    this.createModal = new window.bootstrap.Modal('#modalCreateProjet');
    this.updateModal = new window.bootstrap.Modal('#modalModifierProjet');
    this.deleteModal = new window.bootstrap.Modal('#modalSupprimerProjet');
  }

  private assignUpdateForm(donnees: ProjetModel): void {
    this.updateForm = this.formbuilder.group({
      id: [donnees.id, Validators.required],
      nom: [donnees.nom, Validators.required],
      lien: donnees.lien,
      img: donnees.img,
      description: [donnees.description?.split('<br>').join('\n'), Validators.required]
    });
  }

  // ================ CREATE ===================
  listenStatusCreateModal(): void {
    this.createModal.show();
  }

  onCloseCreate(): void {
    this.createForm.reset();
    this.createModal.hide();
  }

  onSubmitCreate(): void {
    const donnees = this.createForm.value as CreateProjetModel;
    donnees.description = donnees.description?.split('\n').join('<br>');
    if(donnees) {
      this.projetsService.createProjet(donnees);
      this.onCloseCreate();
    }    
  }

  // ================ UPDATE ===================
  listenStatusUpdateModal(donnees: ProjetModel): void {
    this.assignUpdateForm(donnees);
    this.updateModal.show();
  }

  onCloseUpdate(): void {
    this.updateForm.reset();
    this.updateModal.hide();
  }

  onSubmitUpdate(): void {
    const donnees = this.updateForm.value as UpdateProjetModel;
    donnees.description = donnees.description?.split('\n').join('<br>');
    if(donnees) {
      this.projetsService.updateProjet(donnees);
      this.onCloseUpdate();
    }
  }

  // =============== DELETE ===================
  listenStatusDeleteModal(donnees: ProjetModel): void {
    this.currentProjet = donnees;
    this.deleteModal.show();
  }

  onCloseDelete(): void {
    this.currentProjet = null;
    this.deleteModal.hide();
  }

  onConfirmDelete(): void {
    const donnees = this.currentProjet as ProjetModel;
    if(donnees) {
      this.projetsService.deleteProjet(donnees.id);
      this.onCloseDelete();
    }
  }
}
