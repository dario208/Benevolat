import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjetModel } from '../../models/projet.model';

@Component({
  selector: 'app-projet-item',
  templateUrl: './projet-item.component.html',
  styleUrls: ['./projet-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjetItemComponent implements OnInit {

  @Input() projet!: ProjetModel;
  @Output() statusUpdateModal = new EventEmitter<ProjetModel>();
  @Output() statusDeleteModal = new EventEmitter<ProjetModel>();

  constructor() { }

  ngOnInit(): void {
  }

  onUpdate(): void {
    this.statusUpdateModal.emit(this.projet);
  }

  onDelete(): void {
    this.statusDeleteModal.emit(this.projet);
  }
}
