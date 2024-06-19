import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormationModel } from '../../models/formation.model';

@Component({
  selector: 'app-formation-item',
  templateUrl: './formation-item.component.html',
  styleUrls: ['./formation-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormationItemComponent implements OnInit {
  
  @Input() formation!: FormationModel;
  @Output() statusUpdateModal = new EventEmitter<FormationModel>();
  @Output() statusDeleteModal = new EventEmitter<FormationModel>();

  constructor() { }

  ngOnInit(): void {
  }

  onUpdate(): void {
    this.statusUpdateModal.emit(this.formation);
  }

  onDelete(): void {
    this.statusDeleteModal.emit(this.formation);
  }
}
