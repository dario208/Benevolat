import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DistinctionModel } from '../../models/distinction.model';

@Component({
  selector: 'app-distinction-item',
  templateUrl: './distinction-item.component.html',
  styleUrls: ['./distinction-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DistinctionItemComponent implements OnInit {

  @Input() distinction!: DistinctionModel;
  @Output() statusUpdateModal = new EventEmitter<DistinctionModel>();
  @Output() statusDeleteModal = new EventEmitter<DistinctionModel>();


  constructor() { }

  ngOnInit(): void {
  }

  onUpdate(): void {
    this.statusUpdateModal.emit(this.distinction);
  }

  onDelete(): void {
    this.statusDeleteModal.emit(this.distinction);
  }
}
