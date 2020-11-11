import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './Dashboard/home/home.component';
import { AuthGuard } from './services/auth.guard';
import { BugzillaReportComponent } from './reports/bugzilla-report/bugzilla-report.component';
import { NMSSLAFormComponent } from './nms-sla-form/nms-sla-form.component';
import { EmsReportComponent } from './reports/ems-report/ems-report.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'bugzilla', component: BugzillaReportComponent, canActivate: [AuthGuard] },
  { path: 'nms-sla', component: NMSSLAFormComponent, canActivate: [AuthGuard] },
  { path: 'nms-report', component: EmsReportComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
