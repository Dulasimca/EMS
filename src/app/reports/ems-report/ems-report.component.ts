import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { Table } from 'primeng/table';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ems-report',
  templateUrl: './ems-report.component.html',
  styleUrls: ['./ems-report.component.css']
})
export class EmsReportComponent implements OnInit {
  nmsCols: any;
  nmsData = [];
  loading: boolean;
  fromDate: any;
  toDate: any;
  maxDate: Date = new Date();
  typeOptions: SelectItem[];
  type: any;
  items: MenuItem[];
  @ViewChild('dt', { static: false }) table: Table;
  @ViewChild('f', { static: false }) fields: NgForm;

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
    this.nmsCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'location', header: 'Location' },
      { field: 'rm_office', header: 'RM Office' },
      { field: 'dm_office', header: 'DM Office' },
      { field: 'component', header: 'Component' },
      { field: 'shop_number', header: 'Shop Number' },
      { field: 'type', header: 'Type' },
      { field: 'from_date', header: 'From Date' },
      { field: 'to_date', header: 'To Date' },
      { field: 'remarks', header: 'Remarks' }
    ];
    this.typeOptions = [
      { label: '-select-', value: null },
      { label: 'UnPlanned', value: 2 },
      { label: 'Planned', value: 1 }
    ];
  }

  onChange(type) {
    this.nmsData = [];
    if (type === 'D') {
      this.checkValidDateSelection();
    }
    if (this.fromDate !== undefined && this.fromDate !== null && this.fromDate !== '' &&
      this.toDate !== undefined && this.toDate !== null && this.toDate !== '' && this.type !== null
      && this.type !== undefined) {
      const params = new HttpParams().set('FDate', this.datepipe.transform(this.fromDate, 'dd/MM/yyyy'))
        .append('TDate', this.datepipe.transform(this.toDate, 'dd/MM/yyyy'));
      this.restApiService.getByParameters(PathConstants.NMSGetURL, params).subscribe((res: any) => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.nmsData = res.filter(x => {
            return x.sla_type === this.type;
          });
          this.nmsData.forEach(y => {
            y.type = (y.sla_type === 1) ? 'Planned' : 'Unplanned';
          })
          let sno = 1;
          this.nmsData.forEach(i => { i.SlNo = sno; sno += 1; });
          this.loading = false;
        } else {
          this.loading = false;
          this.nmsData = [];
          this.messageService.clear();
          this.messageService.add({
            key: 'msgKey', severity: 'warn',
            summary: 'Warning Message', detail: 'No record found!'
          });
        }
      }, (err: HttpErrorResponse) => {
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
        this.messageService.clear();
        this.messageService.add({
          key: 'msgKey', severity: 'warn', life: 5000
          , summary: 'Invalid Date!', detail: 'Please select the valid date'
        });
        this.fields.controls.fDate.reset();
        this.fields.controls.tDate.reset();
      }
      return this.fromDate, this.toDate;
    }
  }

  exportPdf() {
    // var doc = new jsPDF();
    // doc.text("Tamil Nadu Civil Supplies Corporation - Head Office", 100, 30);
    // doc.setTextColor(37,174,248);
    // var col = this.nmsCols;
    // var rows = [];
    // this.nmsData.forEach(element => {
    //   var temp = [element.SlNo, element.rm_office, element.dm_office,
    //     element.location, element.component, element.shop_number, 
    //   element.type, element.from_date, element.to_date, element.reason,
    //   element.remarks, element.url_path];
    //   rows.push(temp);
    // });
    // doc.autoTable(col, rows);
    // doc.save('Document_Correction.pdf');
    var rows = [];
    this.nmsData.forEach(element => {
      var temp = [element.SlNo, element.rm_office, element.dm_office,
      element.location, element.component, element.shop_number, element.type,
      element.from_date, element.to_date, element.reason, element.remarks,
      element.url_path];
      rows.push(temp);
    });
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('l', 'pt', 'a4');
        doc.autoTable(this.nmsCols, rows);
        doc.save('NMS_REPORT.pdf');
      })
    })
  }

}
