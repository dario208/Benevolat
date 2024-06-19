import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {Chart, registerables} from 'chart.js/auto';
import { map, Observable, tap } from 'rxjs';
import { NombreModel, PromotionsModel, Stat1Model } from '../../models/accueil.model';
import { AccueilService } from '../../services/accueil.service';

Chart.register(...registerables);

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccueilComponent implements OnInit {

  loading$!: Observable<boolean>;
  total$!: Observable<NombreModel>;
  inserer$!: Observable<NombreModel>;
  recherche$!: Observable<NombreModel>;
  etudes$!: Observable<NombreModel>;
  promotions$!: Observable<PromotionsModel[]>;

  stat1$!: Observable<Stat1Model[]>;
  chartStat1!: any;
  promotionsStat1!: string[];
  pourcentageStat1!: string[];

  stat2$!: Observable<NombreModel[]>;
  chartStat2!: any;
  pourcentageStat2!: string[];

  promotionCtrl!: FormControl;

  constructor(
    private accueilService: AccueilService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initObservable();
    this.accueilService.getCountTotal();
    this.accueilService.getCountInserer();
    this.accueilService.getCountRecherche();
    this.accueilService.getCountEtudes();
    this.accueilService.getCountStat1();
    this.accueilService.getCountStat2();
    this.accueilService.getPromotions();
    this.renderStat1([], []);
    this.renderStat2([]);
    this.initData1();
    this.initData2();
    this.initFormCtrl();
  }

  private initObservable(): void {
    this.loading$ = this.accueilService.loading$;
    this.total$ = this.accueilService.total$;
    this.inserer$ = this.accueilService.inserer$;
    this.recherche$ = this.accueilService.recherche$;
    this.etudes$ = this.accueilService.etudes$;
    this.stat1$ = this.accueilService.stat1$;
    this.stat2$ = this.accueilService.stat2$;
    this.promotions$ = this.accueilService.promotions$;
  }

  initData1(): void {
    this.stat1$.pipe(
      tap(response => {
        this.promotionsStat1 = response.map(value => value.promotion);
        this.pourcentageStat1 = response.map(value => value.pourcentage!);
        if(this.promotionsStat1.length !== 0 && this.pourcentageStat1.length !== 0) {
          this.chartStat1.data.labels = this.promotionsStat1;
          this.chartStat1.data.datasets[0].data = this.pourcentageStat1;
          this.chartStat1.update('show');
        }  
      })
    ).subscribe();
  }

  initData2(): void {
    this.stat2$.pipe(
      tap(response => {
        this.pourcentageStat2 = response.map(value => value.pourcentage!);
        if(this.pourcentageStat2.length !== 0) {
          this.chartStat2.data.datasets[0].data = this.pourcentageStat2;
          this.chartStat2.update('show');
        }
      })
    ).subscribe();
  }

  private initFormCtrl(): void {
    this.promotionCtrl = this.formbuilder.control('0', Validators.required);
    this.promotionCtrl.valueChanges.pipe(
      map(value => +value),
      tap(promotion_id => this.accueilService.filtreStat2(promotion_id))
    ).subscribe();
  }

  private renderStat1(promotions: string[], pourcentages: string[]): void {
    this.chartStat1 = new Chart('statistique_1', {
      type: 'bar',
      data: {
        labels: promotions,
        datasets: [{
          label: 'Inserés professionnellement (%)',
          data: pourcentages,
          backgroundColor: [
            '#0093b7'
          ],
          borderRadius: 3
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private renderStat2(pourcentages: string[]): void {
    this.chartStat2 = new Chart('statistique_2',  {
      type: 'doughnut',
      data: {
        labels: ['Inserés professionnellement (%)', 'En recherche d\'opportunités (%)', 'En cours d\'étude (%)'],
        datasets: [{
          label: '',
          data: pourcentages,
          backgroundColor: [
            '#00d89e', '#f32c1d', '#0093b7'
          ],
          hoverOffset: 3
        }]
      }
    });
  }
}
