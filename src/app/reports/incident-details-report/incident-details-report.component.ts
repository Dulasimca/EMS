import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { Table } from 'primeng/table/table';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-incident-details-report',
  templateUrl: './incident-details-report.component.html',
  styleUrls: ['./incident-details-report.component.css']
})
export class IncidentDetailsReportComponent implements OnInit {
  incidentCols: any;
  incidentData = [];
  loading: boolean;
  fromDate: any;
  toDate: any;
  maxDate: Date = new Date();
  items: MenuItem[];
  @ViewChild('dt', { static: false }) table: Table;

  constructor(private messageService: MessageService, private datepipe: DatePipe,
    private restApiService: RestAPIService) { }

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
    this.incidentCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'rname', header: 'Region Name' },
      { field: 'dname', header: 'District Name' },
      { field: 'shopcode', header: 'Shop Number' },
      { field: 'date', header: 'Doc Date' },
      { field: 'reason', header: 'Reason' },
      { field: 'url_path', header: 'URL' },
      { field: 'remarks', header: 'Remarks' }
    ];
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this.messageService.add({
          key: 'msgKey', severity: 'error', life: 5000
          , summary: 'Invalid Date!', detail: 'Please select the valid date'
        });
        this.fromDate = '';
        this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  exportPdf() {
    var rows = [];
    this.incidentData.forEach(element => {
      var temp = [element.SlNo, element.rm_office, element.dm_office,
      element.location, element.component, element.shop_number, element.type,
      element.from_date, element.to_date, element.reason, element.remarks,
      element.url_path];
      rows.push(temp);
    });
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('l', 'pt', 'a4');
        doc.autoTable(this.incidentCols, rows);
        doc.save('NMS_REPORT.pdf');
      })
    })
  }

}
