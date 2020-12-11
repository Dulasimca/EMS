import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  items: MenuItem[];
  showNavBar: boolean;

  constructor() { }

  ngOnInit() {
    this.showNavBar = false;
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: '/home' },
      { label: 'New Ticket', icon: 'pi pi-pw pi-ticket', routerLink: '/NewTicket' },
      { label: 'Browse', icon: 'pi pi-pw pi-sitemap', routerLink: '/home' },
      { label: 'Search', icon: 'pi pi-pw pi-search', routerLink: '/home' },
      {
        label: 'Report', icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'All Ticket', routerLink: '/TicketReport'
          },
          {
            label: 'My Ticket', routerLink: '/TicketReport'
          }
        ]
      },
      { label: 'Administration', icon: 'pi pi-fw pi-id-card', routerLink: '/home' },
      { label: 'Preferences', icon: 'pi pi-fw pi-users', routerLink: '/home' },
    ];
  }

}
