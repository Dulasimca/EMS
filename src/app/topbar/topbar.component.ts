import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
//import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  constructor(private authService: AuthService) { }
  username: string;
  ngOnInit() {
  }

  // onProfileClicked(event, op: OverlayPanel) {
  //   op.toggle(event);
  //   this.username = this.authService.getLoggedUser().user;
  // }

  onLogout() {
    this.authService.logout();
  }

}
