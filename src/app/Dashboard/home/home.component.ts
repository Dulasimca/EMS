import { Component, OnInit } from '@angular/core';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { LocationStrategy } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  barData: any;
  lineData: any;
  pieData: any;
  lineOptions: any;
  NMSLabels: any;
  SLALabels: any;
  barOptions: any;
  pieOptions: any;
  chart: ChartModule;

  constructor(private restApi: RestAPIService, private locationStrategy: LocationStrategy) { }

  ngOnInit() {
    this.preventBackButton();
    this.onLoadBugzillaData();
    this.NMSLabels = ['No.of connections up', 'No.of connections down', 'Video uploaded volume', 'Video downloaded error', 'Video upload error'];
    this.SLALabels = ['Network Up-Time', 'Network Down-Time', 'Planned Downtime', 'Total time logged for poor quality video feed', 'Total Time'];
    this.barData = {
      labels: this.SLALabels,
      datasets: [
        {
          label: 'Time(in percentage)',
          backgroundColor: ['#66BB6A', '#F48FB1 ', '#3498DB', '#26A69A', '#EF5350'],
          data: [35, 65, 40, 61, 86]
        }
      ]
    }
    this.barOptions = {
      scales: {
        xAxes: [{
            barPercentage: 0.27
        }]
    },
      title: {
        display: true,
        text: 'Serivce Level Agreement',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };

    this.lineData = {
      labels: this.NMSLabels,
      datasets: [
        {
          label: "No's",
          data: [65, 59, 80, 81, 55],
          fill: false,
          borderColor: '#4bc0c0'
        }
      ]
    }

    this.lineOptions = {
      title: {
        display: true,
        text: 'Network Management System',
        fontSize: 16
      },
      legend: {
        position: 'bottom'
      }
    };

    this.chart
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
    this.pieOptions = {
      labels: [30,25,25,20],
      title: {
        display: true,
        text: 'Helpdesk Management',
        fontSize: 16
      },
      legend: {
        position: 'top',
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
   
    };
  }

  onLoadBugzillaData() {
    this.restApi.get('/ems/api/bugzilladata').subscribe(data => {
      console.log('data', data.Table);

    })
  }

  onClick() {
   
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    })
  }

}

