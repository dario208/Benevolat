import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, take } from 'rxjs';
import { CreateFormationModel, FormationModel, UpdateFormationModel } from '../../models/formation.model';
import { FormationsService } from '../../services/formation.service';
declare var window: any;

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormationsComponent implements OnInit {

  loading$!: Observable<boolean>;
  formations$!: Observable<FormationModel[]>;
  updateModal: any;
  updateForm!: FormGroup;
  deleteModal: any;
  currentFormation!: FormationModel | null;
  createModal: any;
  createForm!: FormGroup;

  constructor(
    private formationsService: FormationsService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.dragScroll('.card_group');
    this.initObservables();
    this.formationsService.getFormations();
    this.initForm();
    this.currentFormation = null;
    this.initModal();
  }

  private initObservables(): void {
    this.loading$ = this.formationsService.loading$;
    this.formations$ = this.formationsService.formations$;
  }

  private dragScroll(element: string) {
    const slider = <HTMLElement>document.querySelector(element);
    
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
      nom_formation: [null, Validators.required],
      lieu: [null, Validators.required],
      annee: [null, Validators.required],
      description: null
    });

    this.updateForm = this.formbuilder.group({
      id: null, nom_formation: null, lieu: null, annee: null, description: null
    });
  }

  private initModal() : void {
    this.createModal = new window.bootstrap.Modal('#modalCreateFormation');
    this.updateModal = new window.bootstrap.Modal('#modalModifierFormation');
    this.deleteModal = new window.bootstrap.Modal('#modalSupprimerFormation');
  }

  private assignUpdateForm(donnees: FormationModel): void {
    this.updateForm = this.formbuilder.group({
      id: [donnees.id, Validators.required],
      nom_formation: [donnees.nom, Validators.required],
      lieu: [donnees.lieu_formation, Validators.required],
      annee: [donnees.annee, Validators.required],
      description: [donnees.description?.split('<br>').join('\n')]
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
    const donnees = this.createForm.value as CreateFormationModel;
    donnees.description = donnees.description?.split('\n').join('<br>');
    if(donnees) {
      this.formationsService.createFormation(donnees);
      this.onCloseCreate();
    }    
  }

  // ================ UPDATE ===================
  listenStatusUpdateModal(donnees: FormationModel): void {
    this.assignUpdateForm(donnees);
    this.updateModal.show();
  }

  onCloseUpdate(): void {
    this.updateForm.reset();
    this.updateModal.hide();
  }

  onSubmitUpdate(): void {
    const donnees = this.updateForm.value as UpdateFormationModel;
    donnees.description = donnees.description?.split('\n').join('<br>');
    if(donnees) {
      this.formationsService.updateFormation(donnees);
      this.onCloseUpdate();
    }
  }

  // =============== DELETE ===================
  listenStatusDeleteModal(donnees: FormationModel): void {
    this.currentFormation = donnees;
    this.deleteModal.show();
  }

  onCloseDelete(): void {
    this.currentFormation = null;
    this.deleteModal.hide();
  }

  onConfirmDelete(): void {
    const donnees = this.currentFormation as FormationModel;
    if(donnees) {
      this.formationsService.deleteFormation(donnees.id);
      this.onCloseDelete();
    }
  }
}
