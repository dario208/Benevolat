import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CompetenceModel, CreateCompetenceModel, UpdateCompetenceModel } from '../../models/competence.model';
import { CompetencesService } from '../../services/competence.service';
declare var window: any;

@Component({
  selector: 'app-competences',
  templateUrl: './competences.component.html',
  styleUrls: ['./competences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetencesComponent implements OnInit {

  loading$!: Observable<boolean>;
  competences$!: Observable<CompetenceModel[]>;
  updateModal: any;
  updateForm!: FormGroup;
  deleteModal: any;
  currentCompetence!: CompetenceModel | null;
  createModal: any;
  createForm!: FormGroup;

  constructor(
    private competencesService: CompetencesService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.dragScroll('.card_group');
    this.initObservables();
    this.competencesService.getCompetences();
    this.initForm();
    this.currentCompetence = null;
    this.initModal();
  }

  private initObservables(): void {
    this.loading$ = this.competencesService.loading$;
    this.competences$ = this.competencesService.competences$;
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
      nom_competence: [null, Validators.required],
      liste: [null, Validators.required],
      description: null
    });

    this.updateForm = this.formbuilder.group({
      id: null, nom_competence: null, liste: null, description: null
    });
  }

  private initModal(): void {
    this.createModal = new window.bootstrap.Modal('#modalCreateCompetence');
    this.updateModal = new window.bootstrap.Modal('#modalModifierCompetence');
    this.deleteModal = new window.bootstrap.Modal('#modalSupprimerCompetence');
  }

  private assignUpdateForm(donnees: CompetenceModel): void {
    this.updateForm = this.formbuilder.group({
      id: [donnees.id, Validators.required],
      nom_competence: [donnees.nom, Validators.required],
      liste: [donnees.liste, Validators.required],
      description: [donnees.description?.split('<br>').join('\n')]
    });
  }

  // ================ CREATE =================
  listenStatusCreateModal(): void {
    this.createModal.show();
  }

  onCloseCreate(): void {
    this.createForm.reset();
    this.createModal.hide();
  }

  onSubmitCreate(): void {
    const donnees = this.createForm.value as CreateCompetenceModel;
    donnees.description = donnees.description?.split('\n').join('<br>');
    if(donnees) {
      this.competencesService.createComptence(donnees);
      this.onCloseCreate();
    }    
  }

  // ================ UPDATE ===================
  listenStatusUpdateModal(formation: CompetenceModel): void {
    this.assignUpdateForm(formation);
    this.updateModal.show();
  }

  onCloseUpdate(): void {
    this.updateForm.reset();
    this.updateModal.hide();
  }

  onSubmitUpdate(): void {
    const donnees = this.updateForm.value as UpdateCompetenceModel;
    donnees.description = donnees.description?.split('\n').join('<br>');
    if(donnees) {
      this.competencesService.updateCompetence(donnees);
      this.onCloseUpdate();
    }
  }

  // =============== DELETE ===================
  listenStatusDeleteModal(donnees: CompetenceModel): void {
    this.currentCompetence = donnees;
    this.deleteModal.show();
  }

  onCloseDelete(): void {
    this.currentCompetence = null;
    this.deleteModal.hide();
  }

  onConfirmDelete(): void {
    const donnees = this.currentCompetence as CompetenceModel;
    if(donnees) {
      this.competencesService.deleteCompetence(donnees.id);
      this.onCloseDelete();
    }
  }
}
