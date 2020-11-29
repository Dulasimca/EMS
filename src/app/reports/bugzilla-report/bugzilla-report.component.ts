import { Component, OnInit, ViewChild } from '@angular/core';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { Table } from 'primeng/table/table';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bugzilla-report',
  templateUrl: './bugzilla-report.component.html',
  styleUrls: ['./bugzilla-report.component.css']
})
export class BugzillaReportComponent implements OnInit {
  bugzillaCols: any;
  bugzillaData: any;
  loading: boolean;
  items: MenuItem[];
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private restApi: RestAPIService, private route: ActivatedRoute, private messageService: MessageService) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Excel', icon: 'pi pi-file-excel', command: () => {
          this.table.exportCSV();
        }
      },
      {
        label: 'PDF', icon: 'pi pi-file-pdf', command: () => {
          this.exportPdf();
        }
      },
    ];
    const index = this.route.snapshot.queryParamMap.get('id');
    this.bugzillaCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'bug_id', header: 'Bug ID' },
      { field: 'bug_severity', header: 'Bug Severity' },
      { field: 'bug_status', header: 'Bug Status' },
      { field: 'assigned_to', header: 'Assigned To' },
      { field: 'short_desc', header: 'Description' },
      { field: 'creation_ts', header: 'Created Date' }
    ];
    this.loading = true;
    this.restApi.get(PathConstants.HMSReportURL).subscribe(data => {
      if (data !== undefined && data !== null && data.length !== 0) {
        let sno = 1;
        this.bugzillaData = data.Table;
        this.bugzillaData.forEach(x => {
          x.SlNo = sno;
          sno += 1;
        });
        this.bugzillaData.push(
          {
            SlNo: 5, bug_id: 12, bug_severity: 'enhancement', bug_status: 'ASSIGNED', assigned_to: 26,
            short_desc: 'bug test', creation_ts: '2020-06-20T21:48:22'
          },
          {
            SlNo: 6, bug_id: 13, bug_severity: 'enhancement', bug_status: 'OPEN', assigned_to: 31,
            short_desc: 'testing 123', creation_ts: '2020-08-20T21:48:22'
          },
          {
            SlNo: 7, bug_id: 21, bug_severity: 'enhancement', bug_status: 'OPEN', assigned_to: 22,
            short_desc: 'bug test', creation_ts: '2020-12-22T21:48:22'
          },
          {
            SlNo: 8, bug_id: 12, bug_severity: 'enhancement', bug_status: 'IN-PROGRESS', assigned_to: 33,
            short_desc: 'bug test', creation_ts: '2020-10-20T21:48:22'
          },
          {
            SlNo: 9, bug_id: 10, bug_severity: 'enhancement', bug_status: 'IN-PROGRESS', assigned_to: 27,
            short_desc: 'bug test', creation_ts: '2020-11-02T21:48:22'
          },
          {
            SlNo: 10, bug_id: 20, bug_severity: 'enhancement', bug_status: 'OPEN', assigned_to: 21,
            short_desc: 'bug test', creation_ts: '2020-06-11T21:48:22'
          },
          {
            SlNo: 11, bug_id: 9, bug_severity: 'enhancement', bug_status: 'IN-PROGRESS', assigned_to: 30,
            short_desc: 'bug test', creation_ts: '2020-07-20T21:48:22'
          },
          {
            SlNo: 12, bug_id: 32, bug_severity: 'enhancement', bug_status: 'OPEN', assigned_to: 27,
            short_desc: 'bug test', creation_ts: '2020-06-27T21:48:22'
          },
          {
            SlNo: 13, bug_id: 28, bug_severity: 'enhancement', bug_status: 'IN-PROGRESS', assigned_to: 18,
            short_desc: 'bug test', creation_ts: '2020-02-28T21:48:22'
          },
        )
        if (index !== undefined && index !== null) {
          this.bugzillaData = this.bugzillaData.filter(y => {
            return index === '0' && y.bug_status === 'OPEN' || index === '1' && y.bug_status === 'ASSIGNED'
              || index === '2' && y.bug_status === 'IN-PROGRESS' || index === '3' && y.bug_status === 'COMPLETED'
          })
          let slno = 1;
          this.bugzillaData.forEach(x => {
            x.SlNo = slno;
            slno += 1;
          });
        }
        this.loading = false;
      } else {
        this.loading = false;
        this.bugzillaData = [];
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'No record found!'
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please contact administrator!'
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: 'Please check your network connection!'
        });
      }
    });
  }

  exportPdf() {
    var rows = [];
    this.bugzillaData.forEach(element => {
      var temp = [element.SlNo, element.bug_id, element.bug_severity,
      element.bug_status, element.assigned_to, element.short_desc,
      element.creation_ts];
      rows.push(temp);
    });
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('l', 'pt', 'a4');
        doc.autoTable(this.bugzillaCols, rows);
        doc.save('HELPDESK_STATUS_REPORT.pdf');
      })
    })
  }
}
