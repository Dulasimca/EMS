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
  SLALabels: any;
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

    //SLA Bar chart
    this.onSLATypeChange(this.slaType);

    //Pie chart
    this.pieData = {
      labels: ['Open', 'Running', 'Assigned', 'Completed'],
      datasets: [
        {
          label: "Percentage",
          data: [200, 50, 120, 80],
          backgroundColor: [
            "#2ECC71",
            "#5499C7",
            "#F7DC6F",
            "#FA8072"
          ],
          hoverBackgroundColor: [
            "#2ECC71",
            "#5499C7",
            "#F7DC6F",
            "#FA8072"
          ]
        }]
    };
  }

  onSLATypeChange(value) {
    if (value === 'SH') {
      this.SLALabels = ['Camera', '4G-Network', 'UPS'];
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
      this.SLALabels = ['NVR', 'Internet', 'UPS', 'VMS'];
      this.slaBarData = {
        labels: this.SLALabels,
        datasets: [
          {
            label: 'Time(in percentage)',
            backgroundColor: ['#a81313', '#f0dd13', '#09c4d9', '#26870b'],
            data: [62, 85, 70, 58]
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
      this.SLALabels = ['VMS'];
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
            label: "No's",
            data: [65, 59, 80, 81, 60, 55, 100, 110, 75, 58, 150, 170, 101, 99, 87, 121, 74, 65,
              84, 111, 108, 140, 112, 94, 66, 82, 77, 59, 95, 147, 175, 155, 85, 188, 190, 60, 120, 177],
            backgroundColor: '#52c91e',
          }
        ]
      }
      this.nmsBarOptions = {
        scales: {
          xAxes: [{
            barPercentage: 0.22
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

