import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { LocationStrategy } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import * as Chart from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { MasterDataService } from 'src/app/masters-services/master-data.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  chartJs = Chart;
  chartLabelPlugin = ChartDataLabels;
  blockScreen: boolean;
  nmsBarData: any;
  slaBarData: any;
  pieData: any;
  nmsBarOptions: any;
  NMSLabels: any;
  SLALabels: any = [];
  slaBarOptions: any;
  pieOptions: any;
  chart: ChartModule;
  pieChartOptions: any;
  pieChartLabels: string[];
  pieChartColor: any;
  pieChartData: any[];
  plugin: any;
  slaTypeOptions: SelectItem[];
  nmsTypeOptions: SelectItem[];
  slaType: string = 'SH';
  nmsType: string = 'DM';
  districts: string[] = [];
  regions: string[] = [];
  components: any[] = [];

  constructor(private restApi: RestAPIService, private locationStrategy: LocationStrategy,
    private masterDataService: MasterDataService) { }

  ngOnInit() {
    this.preventBackButton();
    this.onLoadBugzillaData();
    this.restApi.get(PathConstants.RegionMasterURL).subscribe(reg => {
      reg.forEach(r => {
        this.regions.push(r.REGNNAME);
      })
      //NMS Bar chart
      this.onNMSTypeChange(this.nmsType);
    })
    this.restApi.get(PathConstants.DistrictMasterURL).subscribe(dist => {
      dist.forEach(d => {
        this.districts.push(d.Dname);
      })
      //NMS Bar chart
      this.onNMSTypeChange(this.nmsType);
    })
    this.restApi.get(PathConstants.ComponentsURL).subscribe((comp: any) => {
      comp.forEach(c => {
        this.components.push({ name: c.name, id: c.product_id} );
      });
      //SLA Bar chart
      this.onSLATypeChange(this.slaType);
    });
    this.slaTypeOptions = [
      { label: 'Retail Shop', value: 'SH' },
      { label: 'DM Office', value: 'DM' },
      { label: 'RM Office', value: 'RM' },
    ];
    this.nmsTypeOptions = [
      { label: 'DM Office', value: 'DM' },
      { label: 'RM Office', value: 'RM' },
    ];

    //Pie chart show data inside each slices
    this.chartJs.plugins.unregister(this.chartLabelPlugin);
    this.plugin = ChartDataLabels;
    this.pieOptions = {
      plugins: {
        datalabels: {
          /* show value in percents */
          formatter: (value, ctx) => {
            let sum = 0;
            const dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
              sum += data;
            });
            const percentage = (value * 100 / sum);
            const calculatedPercent = percentage !== 0 ? percentage.toFixed(2) + '%' : '';
            return calculatedPercent;
          },
          color: '#fff',
          fontSize: 18
        }
      }
    }
    //Pie chart
    this.pieData = {
      labels: ['Open', 'Running', 'Assigned', 'Completed'],
      datasets: [
        {
          label: "Percentage",
          data: [200, 50, 120, 80],
          backgroundColor: [
            "#FA8072",
            "#459ed9",
            "#F7DC6F",
            "#2ECC71"
          ],
          hoverBackgroundColor: [
            "#f26555",
            "#268dd1",
            "#f2d044",
            "#0dd160"
          ]
        }]
    };
  }

  onSLATypeChange(value) {
    if (value === 'SH') {
      this.SLALabels = [];
      var labels = this.components.filter(x => {
        return x.id === 5;
      });
      labels.forEach(y => {
        this.SLALabels.push(y.name);
      });
      this.slaBarData = {
        labels: this.SLALabels,
        datasets: [
          {
            label: 'Time(in percentage)',
            backgroundColor: ['#a81313', '#f0dd13', '#09c4d9'],
            data: [62, 85, 70]
          }
        ]
      }
      this.slaBarOptions = {
        scales: {
          xAxes: [{
            barPercentage: 0.20
          }]
        },
        title: {
          display: true,
          fontSize: 16
        },
        legend: {
          position: 'bottom'
        }
      };
    } else if (value === 'DM') {
      this.SLALabels = [];
      var labels = this.components.filter(x => {
        return x.id === 4;
      });
      labels.forEach(y => {
        this.SLALabels.push(y.name);
      });
      this.slaBarData = {
        labels: this.SLALabels,
        datasets: [
          {
            label: 'Time(in percentage)',
            backgroundColor: ['#a81313', '#f0dd13', '#09c4d9', '#26870b', '#d1ae13'],
            data: [62, 85, 70, 58, 98]
          }
        ]
      }
      this.slaBarOptions = {
        scales: {
          xAxes: [{
            barPercentage: 0.25
          }]
        },
        title: {
          display: true,
          fontSize: 16
        },
        legend: {
          position: 'bottom'
        }
      };
    } else {
      this.SLALabels = [];
      var labels = this.components.filter(x => {
           return x.id === 3;
      });
      labels.forEach(y => {
        this.SLALabels.push(y.name);
      });
      this.slaBarData = {
        labels: this.SLALabels,
        datasets: [
          {
            label: 'Time(in percentage)',
            backgroundColor: ['#a81313'],
            data: [80]
          }
        ]
      }
      this.slaBarOptions = {
        scales: {
          xAxes: [{
            barPercentage: 0.07
          }]
        },
        title: {
          display: true,
          fontSize: 16
        },
        legend: {
          position: 'bottom'
        }
      };
    }
  }

  onNMSTypeChange(value) {
    if (value === 'DM') {
      this.NMSLabels = this.districts;
      this.nmsBarData = {
        labels: this.NMSLabels,
        datasets: [
          {
            label: "Running (in No's)",
            data: [45, 55, 95, 88, 77, 56, 180, 150, 110, 87, 99, 110, 125, 120, 65, 100, 85, 100,
              77, 150, 200, 180, 110, 66, 95, 105, 89, 95, 110, 85, 155, 180, 110, 180, 125, 85, 120, 187],
            backgroundColor: '#52c91e',
          },
          {
            label: "Down (in No's)",
            data: [43, 50, 85, 81, 60, 50, 100, 110, 75, 58, 150, 170, 110, 99, 55, 87, 74, 65,
              60, 111, 108, 140, 90, 55, 66, 82, 77, 80, 95, 65, 120, 155, 85, 150, 95, 55, 98, 137],
            backgroundColor: '#ee1900',
          }
        ]
      }
      this.nmsBarOptions = {
        scales: {
          xAxes: [{
            barPercentage: 0.75,
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        },
        title: {
          display: true,
          fontSize: 16
        },
        legend: {
          position: 'bottom'
        },
        plugins: {
          datalabels: {
            /* show value inside stacked bar */
            formatter: (value, ctx) => {
              let sum = 0;
              for (let i = 0; i <= ctx.chart.data.datasets.length; i++) {
                const dataArr = ctx.chart.data.datasets[i].data;
                dataArr.map(data => {
                  sum += data;
                });
                return value;
              }
            },
            color: "#000000",
            fontSize: 18
          }
        }
      };
    } else {
      this.NMSLabels = this.regions;
      this.nmsBarData = {
        labels: this.NMSLabels,
        datasets: [
          {
            label: "No's",
            data: [65, 59, 80, 81, 60, 88],
            backgroundColor: '#52c91e',
          }
        ]
      }
      this.nmsBarOptions = {
        scales: {
          xAxes: [{
            barPercentage: 0.15
          }]
        },
        title: {
          display: true,
          fontSize: 16
        },
        legend: {
          position: 'bottom'
        }
      };
    }
  }

  onLoadBugzillaData() {
    this.restApi.get('/ems/api/bugzilladata').subscribe(data => {
      console.log('data', data.Table);

    })
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }


}

