import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { LocationStrategy } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import * as Chart from 'chart.js';
import * as ChartDataLabels from 'chartjs-plugin-datalabels';
import { SelectItem } from 'primeng/api';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  chartJs = Chart;
  chartLabelPlugin = ChartDataLabels;
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
  slaType: string = 'SH';

  constructor(private restApi: RestAPIService, private locationStrategy: LocationStrategy) { }

  ngOnInit() {
    this.preventBackButton();
    this.onLoadBugzillaData();
    this.slaTypeOptions = [
      {label: 'Shop', value: 'SH'},
      {label: 'DM Office', value: 'DM'},
      {label: 'RM Office', value: 'RM'},
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

    //NMS Bar chart
    this.NMSLabels = ['No.of connections up', 'No.of connections down', 'Video uploaded volume', 'Video downloaded error', 'Video upload error'];
    this.nmsBarData = {
      labels: this.NMSLabels,
      datasets: [
        {
          label: "No's",
          data: [65, 59, 80, 81, 60],
          backgroundColor: ['#52c91e', '#09d6d3', '#f7074b', '#edcf24', '#1c83eb'],
        }
      ]
    }

    this.nmsBarOptions = {
      scales: {
        xAxes: [{
            barPercentage: 0.28
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

  onSLATypeChange(type) {
    if(type === 'SH') {
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
     } else if(type === 'DM') {
      this.SLALabels =  ['NVR', 'Internet', 'UPS', 'VMS'];
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
     this.onRefreshChart();
  }

  onRefreshChart() {
    console.log('refreshed');
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

