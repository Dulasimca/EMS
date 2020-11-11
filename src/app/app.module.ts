import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {TabMenuModule} from 'primeng/tabmenu';
import {ChartModule} from 'primeng/chart';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import {SidebarModule} from 'primeng/sidebar';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './Dashboard/home/home.component';
import { MenubarComponent } from './menubar/menubar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { LoginComponent } from './login/login.component';
import { RestAPIService } from './services/restAPI.service';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './footer/footer.component';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { BugzillaReportComponent } from './reports/bugzilla-report/bugzilla-report.component';
import { ScreenReaderComponent } from './screen-reader/screen-reader.component';
import { NMSSLAFormComponent } from './nms-sla-form/nms-sla-form.component';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { EmsReportComponent } from './reports/ems-report/ems-report.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenubarComponent,
    TopbarComponent,
    LoginComponent,
    FooterComponent,
    BugzillaReportComponent,
    ScreenReaderComponent,
    NMSSLAFormComponent,
    EmsReportComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    DropdownModule,
    CheckboxModule,
    TabMenuModule,
    TableModule,
    ChartModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    PanelModule,
    ButtonModule,
    ReactiveFormsModule,
    SidebarModule,
    ProgressSpinnerModule,
    CalendarModule,
    OverlayPanelModule,
  ],
  providers: [AuthService, RestAPIService, DatePipe, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
