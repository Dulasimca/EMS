import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ThemeService } from '../theme/theme.service';


@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  items: MenuItem[];
  showNavBar: boolean;

  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.showNavBar = false;
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/home' },
      {
        label: 'Document', icon: 'pi pi-fw pi-desktop',
        items: [
          {
            label: 'NMS-Form', routerLink: '/nms-sla'
          },
          {
            label: 'Incident-Form', routerLink: '/incident-form'
          }
        ]
      },
      { label: 'SLA', icon: 'pi pi-fw pi-chart-line' },
      {
        label: 'Help Desk', icon: 'pi pi-fw pi-comments',
        routerLink: '/bugzilla'
      },
      {
        label: 'Report', icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'NMS-Report', routerLink: '/nms-report'
          },
          {
            label: 'Incident-Report', routerLink: '/incident-report'
          }
        ]
      }
    ];
  }

}
