import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionService } from 'src/app/core/services/session.service';
import { EmploisService } from '../../services/emplois.service';
import { OthersService } from '../../services/others.service';
import { menu_liste } from './liste_menu';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent implements OnInit {
  menu!: { pathSvg_1: string, pathSvg_2?: string, label: string, route: string }[];
  buttonSidenav!: HTMLElement;
  statusSidebar!: boolean;

  current$!: Observable<boolean>;

  @Output() statusSidebarToEmit = new EventEmitter<{statusSidebar: boolean}>();

  constructor(
    private sessionService: SessionService,
    private othersService: OthersService
  ) { }

  ngOnInit(): void {
    this.menu = menu_liste;
    this.buttonSidenav = <HTMLElement>document.querySelector('#toggle_sidebar svg');

    !localStorage.getItem('statusSidebarDashbord')
      && localStorage.setItem('statusSidebarDashbord', `${true}`);
    this.statusSidebar = localStorage.getItem('statusSidebarDashbord') === 'true';

    this.current$ = this.othersService.current$;
    this.othersService.getCurrent();
  }

  onToggleSidebar() {
    if(this.statusSidebar) {
      (this.buttonSidenav).style.transform = 'rotate(180deg)';
    }
    else {
      (this.buttonSidenav).style.transform = 'rotate(0deg)';
    }

    this.statusSidebar = !this.statusSidebar;
    localStorage.setItem('statusSidebarDashbord', `${this.statusSidebar}`);
    this.statusSidebarToEmit.emit({statusSidebar: this.statusSidebar});
  }

  onLogout(): void {
    this.sessionService.logOut();
  }
}
