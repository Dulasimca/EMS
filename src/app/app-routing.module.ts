import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './Dashboard/home/home.component';
import { AuthGuard } from './services/auth.guard';
import { BugzillaReportComponent } from './reports/bugzilla-report/bugzilla-report.component';
import { NMSSLAFormComponent } from './Documents/nms-sla-form/nms-sla-form.component';
import { EmsReportComponent } from './reports/ems-report/ems-report.component';
import { IncidentDetailsFormComponent } from './Documents/incident-details-form/incident-details-form.component';
import { IncidentDetailsReportComponent } from './reports/incident-details-report/incident-details-report.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'bugzilla', component: BugzillaReportComponent, canActivate: [AuthGuard] },
  { path: 'nms-sla', component: NMSSLAFormComponent, canActivate: [AuthGuard] },
  { path: 'nms-report', component: EmsReportComponent, canActivate: [AuthGuard] },
  { path: 'incident-form', component: IncidentDetailsFormComponent, canActivate: [AuthGuard] },
  { path: 'incident-report', component: IncidentDetailsReportComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
