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
  NMSLabels: any = [];
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
  districts: any = [];
  regions: string[] = [];
  components: any[] = [];
  nmsBarType: string;
  shops: any = [];
  pieLabels: string[] = [];
  bug_count: any = [];
  incidents: any = [];
  months: string[];
  maxLimitOfIncident: number;
  stepSizeOfIncident: number;

  constructor(private restApi: RestAPIService, private locationStrategy: LocationStrategy,
    private masterDataService: MasterDataService, private router: Router) { }

  ngOnInit() {
    this.preventBackButton();
    this.months = ["August", "September", "October", "November", "December",
      "January", "February", "March", "April", "May", "June", "July"
    ];
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
    this.restApi.get(PathConstants.RegionMasterURL).subscribe(reg => {
      reg.forEach(r => {
        this.regions.push(r.REGNNAME);
      })
      //NMS Bar chart
      this.onNMSTypeChange(this.nmsType);
    })
    this.restApi.get(PathConstants.ComponentsURL).subscribe((comp: any) => {
      comp.forEach(c => {
        this.components.push({ name: c.name, id: c.product_id });
      });
      this.restApi.getByParameters(PathConstants.ShopsGetURL, { 'type': 1 }).subscribe(shop => {
        shop.forEach(s => {
          var str: string = s.district;
          var firstStr = str.slice(0, 1).toUpperCase();
          var secondStr = str.slice(1, str.length).toLowerCase();
          str = firstStr + secondStr;
          this.districts.push(str);
          this.shops.push({ 'count': s.shopcount, 'status': s.installation_status, 'dcode': s.dcode });
          //NMS Bar chart
          this.onNMSTypeChange(this.nmsType);
        })
      })
      //SLA Bar chart
      this.onSLATypeChange(this.slaType);
    });

    //Pie chart
    this.onLoadHMSChart();

    //Line Chart
    this.restApi.getByParameters(PathConstants.MonthwiseIncidentGetURL, { 'type': 1 }).subscribe(data => {
      for (let i = 0; i < this.months.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (this.months[i] === data[j].doc_date) {
            this.incidents.splice(i, 0, data[j].count);
            break;
          }
          if (this.incidents.length === data.length) {
            this.incidents.splice(i, 0, 0);
          }
        }
        if (this.incidents.length > data.length) {
          this.incidents.splice(i, 0, 0);
        }
      }
      this.maxLimitOfIncident = this.incidents.reduce((a, b) => Math.max(a, b));
      this.stepSizeOfIncident = (this.maxLimitOfIncident.toString().length === 1) ? 1 :
        ((this.maxLimitOfIncident.toString().length === 2) ? 10 : 100);
      this.onLoadIncidentChart();
    })
  }

  onLoadHMSChart() {
    this.pieLabels = ['Assigned', 'Completed', 'In-Progress', 'Open'];
    this.restApi.getByParameters(PathConstants.HMSReportURL, { 'value': 1 }).subscribe(res => {
      for (let i = 0; i < this.pieLabels.length; i++) {
        res.forEach(c => {
          if (this.pieLabels[i].toLowerCase() === c.bug_status.toLowerCase()) {
            this.bug_count.push(c.bug_count);
          }
        })
      }
      this.pieData = {
        labels: this.pieLabels,
        datasets: [
          {
            label: "Percentage",
            data: this.bug_count,
            backgroundColor: [
              "#f5953b",
              "#4fc437",
              "#f7ee39",
              "#f73e3e",
            ],
            hoverBackgroundColor: [
              "#f2851f",
              "#3abf1f",
              "#fff305",
              "#ed2d2d",
            ]
          }]
      };
    })
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
      },
      legend: {
        position: 'bottom'
      }
    }
  }

  onLoadIncidentChart() {
    const year = new Date().getFullYear();
    this.incidentLineData = {
      labels: this.months,
      datasets: [
        {
          label: 'Months ( From Year' + ' ' + year + ' - ' + (year + 1) + ' )',
          data: this.incidents,
          fill: false,
          borderColor: '#4bc0c0',
          lineTension: 0.08,
        }
      ],
    }
    this.incidentLineOptions = {
      responsive: true,
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: this.maxLimitOfIncident,
            stepSize: this.stepSizeOfIncident
          }
        }]
      },
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
      var dataset = [];
      var bgColor: string[] = [];
      this.shops.forEach(s => {
        if (s.status) {
          bgColor.push('#52c91e');
        } else {
          bgColor.push('#fc2121');
        }
        dataset.push(s.count);
        this.nmsBarData = {
          labels: this.NMSLabels,
          datasets: [
            {
              label: "Running (in No's)",
              data: dataset,
              backgroundColor: bgColor,
            },
            {
              label: "Not Running (in No's)",
              backgroundColor: '#52c91e',
            }
          ]
        }
      })
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
            label: "Not Running (in No's)",
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

