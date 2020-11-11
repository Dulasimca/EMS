import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';


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
      {label: 'Home', icon: 'pi pi-fw pi-home'},
      {label: 'NMS', icon: 'pi pi-fw pi-desktop'},
      {label: 'SLA', icon: 'pi pi-fw pi-chart-line'},
      {label: 'Help Desk', icon: 'pi pi-fw pi-comments'},
      {label: 'Report', icon: 'pi pi-fw pi-file'}
  ];
  }

}
