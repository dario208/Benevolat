import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { DomainesOthersModel, ExporterModel, FilieresOthersModel, 
  PromotionsOthersModel, RegionsOthersModel, 
  StatusProOthersModel } from '../../models/others.model';
import { OthersService } from '../../services/others.service';

@Component({
  selector: 'app-exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.scss']
})
export class ExporterComponent implements OnInit {
  statuspro$!: Observable<StatusProOthersModel[]>;
  domaines$!: Observable<DomainesOthersModel[]>;
  filieres$!: Observable<FilieresOthersModel[]>;
  promotions$!: Observable<PromotionsOthersModel[]>;
  regions$!: Observable<RegionsOthersModel[]>;
  loading$!: Observable<boolean>;

  exporterForm!: FormGroup;
  statusproArray!: FormArray;
  domainesArray!: FormArray;
  filieresArray!: FormArray;
  promotionsArray!: FormArray;
  regionsArray!: FormArray;

  constructor(
    private othersService: OthersService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initObservable();
    this.othersService.getallChoices();
    this.initForm();
  }

  private initObservable(): void {
    this.loading$ = this.othersService.loading$;
    this.statuspro$ = this.othersService.statuspro$;
    this.domaines$ = this.othersService.domaines$;
    this.filieres$ = this.othersService.filieres$;
    this.promotions$ = this.othersService.promotions$;
    this.regions$ = this.othersService.regions$;
  }

  private initForm(): void {
    this.statusproArray = this.formbuilder.array([]);
    this.domainesArray = this.formbuilder.array([]);
    this.filieresArray = this.formbuilder.array([]);
    this.promotionsArray = this.formbuilder.array([]);
    this.regionsArray = this.formbuilder.array([]);

    this.exporterForm = this.formbuilder.group({
      domaine_id: this.domainesArray,
      promotion_id: this.promotionsArray,
      filiere_id: this.filieresArray,
      status_id: this.statusproArray,
      region_id: this.regionsArray
    });
  }

  onChangeStatuspro(event: any): void {
    const select = this.statusproArray as FormArray;
    if(event.target.checked) {
      select.push(new FormControl(event.target.value));
    }
    else {
      const index = select.controls
        .findIndex(item => item.value === event.target.value);
      select.removeAt(index);
    }
  }

  onChangeDomaines(event: any): void {
    const select = this.domainesArray as FormArray;
    if(event.target.checked) {
      select.push(new FormControl(event.target.value));
    }
    else {
      const index = select.controls
        .findIndex(item => item.value === event.target.value);
      select.removeAt(index);
    }
  }

  onChangeFilieres(event: any): void {
    const select = this.filieresArray as FormArray;
    if(event.target.checked) {
      select.push(new FormControl(event.target.value));
    }
    else {
      const index = select.controls
        .findIndex(item => item.value === event.target.value);
      select.removeAt(index);
    }
  }

  onChangePromotions(event: any): void {
    const select = this.promotionsArray as FormArray;
    if(event.target.checked) {
      select.push(new FormControl(event.target.value));
    }
    else {
      const index = select.controls
        .findIndex(item => item.value === event.target.value);
      select.removeAt(index);
    }
  }

  onChangeRegions(event: any): void {
    const select = this.regionsArray as FormArray;
    if(event.target.checked) {
      select.push(new FormControl(event.target.value));
    }
    else {
      const index = select.controls
        .findIndex(item => item.value === event.target.value);
      select.removeAt(index);
    }
  }

  onSubmitExporter(): void {
    const donnees = this.exporterForm.value as ExporterModel;
    if(!donnees) return;
    this.othersService.exportExcelFile(donnees);
  }
}
