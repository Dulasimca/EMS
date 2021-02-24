import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-all-incident-report',
  templateUrl: './all-incident-report.component.html',
  styleUrls: ['./all-incident-report.component.css']
})
export class AllIncidentReportComponent implements OnInit {
  incidentCols: any;
  incidentData = [];
  loading: boolean;
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private messageService: MessageService, private datepipe: DatePipe,
    private restApiService: RestAPIService) { }

  ngOnInit() {
    this.incidentCols = [
      { field: 'REGNNAME', header: 'Region Name' },
      { field: 'Dname', header: 'District Name' },
      { field: 'shopcode', header: 'Shop Number' },
      { field: 'doc_date', header: 'Incident Date' },
      { field: 'reason', header: 'Reason' },
      { field: 'url_path', header: 'URL' },
      { field: 'remarks', header: 'Remarks' }
    ];
    this.loading = true;
    this.onLoadTable();
  }

  onLoadTable() {
      this.loading = true;
      this.restApiService.getByParameters(PathConstants.IncidentGetURL, {'type': 1}).subscribe((res: any) => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.incidentData = res;
          this.loading = false;
        } else {
          this.loading = false;
          this.table.reset();
          this.messageService.clear();
          this.messageService.add({
            key: 'msgKey', severity: 'warn',
            summary: 'Warning Message', detail: 'No record found!'
          });
        }
      }, (err: HttpErrorResponse) => {
        this.loading = false;
        this.table.reset();
        if (err.status === 0 || err.status === 400) {
          this.messageService.clear();
          this.messageService.add({
            key: 'msgKey', severity: 'error',
            summary: 'Error Message', detail: 'Please contact administrator!'
          });
        } else {
          this.messageService.clear();
          this.messageService.add({
            key: 'msgKey', severity: 'error',
            summary: 'Error Message', detail: 'Please check your network connection!'
          });
        }
      });
    }
  }

