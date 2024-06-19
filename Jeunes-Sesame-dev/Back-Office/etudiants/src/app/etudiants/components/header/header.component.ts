import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AproposModel } from '../../models/apropos.model';
import { AproposService } from '../../services/apropos.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {

  apropos$!: Observable<AproposModel>;

  constructor(
    private aproposService: AproposService
  ) { }

  ngOnInit(): void {
    this.apropos$ = this.aproposService.apropos$;
    this.aproposService.getApropos();
  }

}
