import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { LocationStrategy } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import * as Chart from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { type } from 'os';


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
        var str: string = d.Dname;
        var firstStr = str.slice(0, 1).toUpperCase();
        var secondStr = str.slice(1, str.length).toLowerCase();
        str = firstStr + secondStr;
        this.districts.push(str);
      })
      //NMS Bar chart
      this.onNMSTypeChange(this.nmsType);
    })
    this.restApi.get(PathConstants.ComponentsURL).subscribe((comp: any) => {
      comp.forEach(c => {
        this.components.push({ name: c.name, id: c.product_id });
      });
      //SLA Bar chart
      this.onSLATypeChange(this.slaType);
    });
    this.slaTypeOptions = [
      { label: 'Retail Shop', value: 'SH' },
      { label: 'DM Office', value: 'DM' },
      { label: 'RM Office', value: 'RM' },
      { label: 'HeadOffice', value: 'HO' }
    ];
    this.nmsTypeOptions = [
      { label: 'DM Office', value: 'DM' },
      { label: 'RM Office', value: 'RM' },
      { label: 'HeadOffice', value: 'HO' }
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
      labels: ['Open', 'Assigned', 'In-Progress', 'Completed'],
      datasets: [
        {
          label: "Percentage",
          data: [200, 50, 120, 80],
          backgroundColor: [
            "#f73e3e",
            "#f5953b",
            "#f7ee39",
            "#4fc437"
          ],
          hoverBackgroundColor: [
            "#ed2d2d",
            "#f2851f",
            "#fff305",
            "#3abf1f"
          ]
        }]
    };
  }

  onSLATypeChange(value) {
    this.slaBarOptions = {
      scales: {
        xAxes: [{
          barPercentage: 0.21
        }],
        yAxes: [{
          ticks: {
            min: 50,
            max: 100,
            stepSize: 10
          }
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
            backgroundColor: ['#1ebf1b', '#f0dd13', '#09c4d9'],
            data: [62, 85, 70]
          }
        ]
      }
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
            backgroundColor: ['#f77c2f', '#f0dd13', '#09c4d9', '#26870b', '#d1ae13'],
            data: [62, 85, 70, 58, 98]
          }
        ]
      }
    } else if (value === 'RM') {
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
            backgroundColor: ['#4fc437', '#f0dd13', '#09c4d9',],
            data: [60, 80, 100]
          }
        ]
      }
    } else if (value === 'HO') {
      this.SLALabels = [];
      var labels = this.components.filter(x => {
        return x.id === 6;
      });
      labels.forEach(y => {
        this.SLALabels.push(y.name);
      });
      this.slaBarData = {
        labels: this.SLALabels,
        datasets: [
          {
            label: 'Time(in percentage)',
            backgroundColor: ['#1dbfba', '#f0dd13', '#4fc437',],
            data: [80, 90, 70]
          }
        ]
      }
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
            label: "Not Running (in No's)",
            data: [43, 50, 85, 81, 60, 50, 100, 110, 75, 58, 150, 170, 110, 99, 55, 87, 74, 65,
              60, 111, 108, 140, 90, 55, 66, 82, 77, 80, 95, 65, 120, 155, 85, 150, 95, 55, 98, 137],
            backgroundColor: '#fc2121',
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

