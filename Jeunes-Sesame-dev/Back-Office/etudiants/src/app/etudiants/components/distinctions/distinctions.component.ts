import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CreateDistinctionModel, DistinctionModel, UpdateDistinctionModel } from '../../models/distinction.model';
import { DistinctionsService } from '../../services/distinction.service';
declare var window: any;

@Component({
  selector: 'app-distinctions',
  templateUrl: './distinctions.component.html',
  styleUrls: ['./distinctions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DistinctionsComponent implements OnInit {

  loading$!: Observable<boolean>;
  distinctions$!: Observable<DistinctionModel[]>;
  updateModal: any;
  updateForm!: FormGroup;
  deleteModal: any;
  currentDistinction!: DistinctionModel | null;
  createModal: any;
  createForm!: FormGroup;

  constructor(
    private distinctionsService: DistinctionsService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.dragScroll('.card_group');
    this.initObservables();
    this.distinctionsService.getDistinctions();
    this.initForm();
    this.currentDistinction = null;
    this.initModal();
  }

  private initObservables(): void {
    this.loading$ = this.distinctionsService.loading$;
    this.distinctions$ = this.distinctionsService.distinctions$;
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
      nom_distinction: [null, Validators.required],
      organisateur: [null, Validators.required],
      lieu: [null, Validators.required],
      annee: [null, Validators.required],
      description: null
    });

    this.updateForm = this.formbuilder.group({
      id: null, nom_distinction: null, organisateur: null, lieu: null, annee: null, description: null
    });
  }

  private initModal() : void {
    this.createModal = new window.bootstrap.Modal('#modalCreateDistinction');
    this.updateModal = new window.bootstrap.Modal('#modalModifierDistinction');
    this.deleteModal = new window.bootstrap.Modal('#modalSupprimerDistinction');
  }

  private assignUpdateForm(donnees: DistinctionModel): void {
    this.updateForm = this.formbuilder.group({
      id: [donnees.id, Validators.required],
      nom_distinction: [donnees.nom, Validators.required],
      organisateur: [donnees.organisateur, Validators.required],
      lieu: [donnees.lieu, Validators.required],
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
    const donnees = this.createForm.value as CreateDistinctionModel;
    donnees.description = donnees.description?.split('\n').join('<br>');
    if(donnees) {
      this.distinctionsService.createDistinction(donnees);
      this.onCloseCreate();
    }    
  }

  // ================ UPDATE ===================
  listenStatusUpdateModal(donnees: DistinctionModel): void {
    this.assignUpdateForm(donnees);
    this.updateModal.show();
  }

  onCloseUpdate(): void {
    this.updateForm.reset();
    this.updateModal.hide();
  }

  onSubmitUpdate(): void {
    const donnees = this.updateForm.value as UpdateDistinctionModel;
    donnees.description = donnees.description?.split('\n').join('<br>');
    if(donnees) {
      this.distinctionsService.updateDistinction(donnees);
      this.onCloseUpdate();
    }
  }

  // =============== DELETE ===================
  listenStatusDeleteModal(donnees: DistinctionModel): void {
    this.currentDistinction = donnees;
    this.deleteModal.show();
  }

  onCloseDelete(): void {
    this.currentDistinction = null;
    this.deleteModal.hide();
  }

  onConfirmDelete(): void {
    const donnees = this.currentDistinction as DistinctionModel;
    if(donnees) {
      this.distinctionsService.deleteDistinction(donnees.id);
      this.onCloseDelete();
    }
  }
}
