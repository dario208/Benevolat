import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmploisModel } from '../../models/emplois.model';

@Component({
  selector: 'app-emploi-item',
  templateUrl: './emploi-item.component.html',
  styleUrls: ['./emploi-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmploiItemComponent implements OnInit {
  @Input() emploi!: EmploisModel;
  @Output() displayModal = new EventEmitter<EmploisModel>();
  @Output() statusUpdateModal = new EventEmitter<EmploisModel>();
  @Output() statusDeleteModal = new EventEmitter<EmploisModel>();
  current!: boolean; 

  constructor() { }

  ngOnInit(): void {
    this.current = (Date.now() -  Date.parse(this.emploi.created_at.toString())) < 86400000;
  }

  onDisplay(): void {
    this.displayModal.emit(this.emploi);
  }

  onUpdate(): void {
    this.statusUpdateModal.emit(this.emploi);
  }

  onDelete(): void {
    this.statusDeleteModal.emit(this.emploi);
  }
}
