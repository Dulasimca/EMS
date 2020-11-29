import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { LocationStrategy, DatePipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import * as Chart from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { MasterDataService } from 'src/app/masters-services/master-data.service';
import { type } from 'os';
import { Router } from '@angular/router';
import { black } from 'color-name';


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
  incidentLineData: any;
  incidentLineOptions: any;
  slaTypeOptions: SelectItem[];
  nmsTypeOptions: SelectItem[];
  slaType: string = 'SH';
  nmsType: string = 'DM';
  districts: string[] = [];
  regions: string[] = [];
  components: any[] = [];
  nmsBarType: string;

  constructor(private restApi: RestAPIService, private locationStrategy: LocationStrategy,
    private masterDataService: MasterDataService, private router: Router) { }

  ngOnInit() {
    this.preventBackButton();
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

    //Line Chart
    const months = ["August", "September", "October", "November", "December",
      "January", "February", "March", "April", "May", "June", "July"
    ];
    const year = new Date().getFullYear();
    this.incidentLineData = {
      labels: months,
      datasets: [
        {
          label: 'Months ( From Year' + ' ' + year + ' )',
          data: [65, 59, 80, 81, 91, 60, 70, 97, 65, 80, 75, 90],
          fill: false,
          borderColor: '#4bc0c0',
          lineTension: 0.08,
        }
      ],
    }
    this.incidentLineOptions = {
      responsive: true,
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          backgroundColor: '4bc0c0',
          color: 'black',
          boredrRadius: 4,
          font: {
            weight: 'bold'
          }
        }

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
            stepSize: 10,
            callback: function (value, index, values) {
              return value + '%';
            }
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
        return x.id === 2;
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
      this.nmsBarType = 'bar';
      this.nmsBarData = {
        labels: this.NMSLabels,
        datasets: [
          {
            label: "Running (in No's)",
            data: [300, 0, 0, 0, 250, 220, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              0, 0, 0, 0, 0, 0, 290, 315, 375, 0, 250, 280, 0, 310, 250, 0, 0, 310, 225, 0],
            backgroundColor: '#52c91e',
          },
          {
            label: "Not Running (in No's)",
            data: [0, 95, 85, 81, 0, 0, 100, 180, 75, 58, 150, 170, 110, 99, 155, 187, 74, 165,
              180, 111, 108, 140, 90, 155, 0, 0, 0, 80, 0, 0, 120, 0, 0, 150, 195, 0, 0, 137],
            backgroundColor: '#fc2121',
          }
        ]
      }
      this.nmsBarOptions = {
        scales: {
          xAxes: [{
            barPercentage: 0.80,
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
                var data = (value !== 0) ? value : '';
                return data;
              }
            },
            color: "#000000",
            fontSize: 14
          }
        }
      };
    } else if (value === 'RM') {
      this.NMSLabels = this.regions;
      this.nmsBarType = 'bar';
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
    } else {
      this.NMSLabels = ['Shops'];
      this.nmsBarType = 'horizontalBar';
      this.nmsBarData = {
        labels: this.NMSLabels,
        datasets: [
          {
            label: "Running (in No's)",
            data: [1000],
            backgroundColor: '#52c91e',
          },
          {
            label: "Not Running (No's)",
            data: [2000],
            backgroundColor: '#fc2121',
          }
        ]
      }
      this.nmsBarOptions = {
        scales: {
          yAxes: [{
            stacked: true,
            barPercentage: 0.12
          }],
          xAxes: [{
            stacked: true,
            ticks: {
              min: 0,
              max: 3200,
              stepSize: 200
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
    }
  }

  selectData(event) {
    const index: string = event.element._index;
    this.router.navigate(['bugzilla'], { queryParams: { id: index, si: true } });
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }


}

