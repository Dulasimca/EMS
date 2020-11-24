import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService, SelectItem } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { Table } from 'primeng/table';

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
      { field: 'rm_office', header: 'RM Office' },
      { field: 'dm_office', header: 'DM Office' },
      { field: 'location', header: 'Location' },
      { field: 'component', header: 'Component' },
      { field: 'shop_number', header: 'Shop Number' },
      { field: 'type', header: 'Type' },
      { field: 'from_date', header: 'From Date' },
      { field: 'to_date', header: 'To Date' },
      { field: 'reason', header: 'Reason' },
      { field: 'remarks', header: 'Remarks' },
      { field: 'url_path', header: 'URL' }
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
      this.nmsData.push(
        {
          SlNo: 1, rm_office: 'HeadOffice', dm_office: 'Dindigul', shop_number: '12456',
          from_date: '01/11/2020 03:00 PM', to_date: '05/11/2020 05:10 PM', type: 'Unplanned',
          location: 'RM Office', component: 'VMS', reason: 'Scheduled', remarks: 'testing', url_path: 'https://abcd'
        },
        {
          SlNo: 2, rm_office: 'Salem', dm_office: 'Cuddalore', shop_number: '456001',
          from_date: '07/11/2020 10:21 AM', to_date: '09/10/2020 05:10 PM', type: 'Planned', camera_pos: 2,
          network: 'Down', location: 'DM Office', component: 'INTERNET', reason: 'Non-Scheduled', remarks: '', url_path: 'https://jhdj.in'
        },
        {
          SlNo: 3, rm_office: 'Coimbatore', dm_office: 'Erode', shop_number: '772106',
          from_date: '02/11/2020 05:21 PM', to_date: '03/11/2020 07:10 PM', type: 'Unplanned',
          location: 'RM Office', component: 'VMS', reason: 'Scheduled', remarks: '', url_path: 'https://www.google.com'
        },
        {
          SlNo: 4, rm_office: 'HeadOffice', dm_office: 'Namakkal', shop_number: '80457',
          from_date: '12/11/2020 08:00 AM', to_date: '13/10/2020 09:10 AM', type: 'Planned',
          location: 'DM Office', component: 'INTERNET', reason: 'Accidental', remarks: 'testing', url_path: 'https://abcd'
        },
        {
          SlNo: 5, rm_office: 'Salem', dm_office: 'Dindigul', shop_number: '40056',
          from_date: '11/11/2020 08:00 AM', to_date: '11/11/2020 10:00 AM', type: 'Unplanned', camera_pos: 2,
          network: 'Down', location: 'Shop', component: 'CAMERA', reason: 'Incidental', remarks: 'testing 1', url_path: 'https://yyt.in'
        },
        {
          SlNo: 6, rm_office: 'Trichy', dm_office: 'Trichy', shop_number: '75456',
          from_date: '02/11/2020 09:10 AM', to_date: '04/11/2020 11:10 AM', type: 'Unplanned',
          location: 'RM Office', component: 'VMS', reason: 'Scheduled', remarks: 'testing 2', url_path: 'https://qqq.com'
        },
        {
          SlNo: 7, rm_office: 'Coimbatore', dm_office: 'Vellore', shop_number: '20156',
          from_date: '02/10/2020 11:21 AM', to_date: '05/10/2020 05:10 PM', type: 'Planned', camera_pos: 1,
          network: 'Down', location: 'DM Office', component: 'UPS', reason: 'Non-Scheduled', remarks: '', url_path: 'https://pss.com'
        },
        {
          SlNo: 8, rm_office: 'HeadOffice', dm_office: 'Villipuram', shop_number: '45475',
          from_date: '02/11/2020 08:10 AM', to_date: '05/11/2020 05:10 PM', type: 'Unplanned', camera_pos: 2,
          network: 'Up', location: 'Shop', component: '4G-NETWORK', reason: 'Incidental', remarks: 'testing 3', url_path: 'https://trt.in'
        },
        {
          SlNo: 9, rm_office: 'Salem', dm_office: 'Salem', shop_number: '45784',
          from_date: '05/10/2020 10:00 AM', to_date: '08/10/2020 11:00 AM', type: 'Planned', camera_pos: 1,
          network: 'Down', location: 'RM Office', component: 'VMS', reason: 'Scheduled', remarks: '', url_path: 'https://testing.com'
        },
        {
          SlNo: 10, rm_office: 'HeadOffice', dm_office: 'Thirunelveli', shop_number: '12407',
          from_date: '02/10/2020 11:21 AM', to_date: '05/10/2020 05:10 PM', type: 'Unplanned',
          location: 'DM Office', component: 'INTERNET', reason: 'Scheduled', remarks: 'testing', url_path: 'https://www.test.com'
        },
        {
          SlNo: 11, rm_office: 'Salem', dm_office: 'Coimbatore', shop_number: '78740',
          from_date: '10/10/2020 11:21 AM', to_date: '12/10/2020 05:10 PM', type: 'Planned', camera_pos: 2,
          network: 'Down', location: 'RM Office', component: 'VMS', reason: 'Non-Scheduled', remarks: 'testing', url_path: 'https://abcd'
        },
        {
          SlNo: 12, rm_office: 'Salem', dm_office: 'Salem', shop_number: '548700',
          from_date: '01/10/2020 11:00 AM', to_date: '02/10/2020 02:10 PM', type: 'Unplanned',
          location: 'RM Office', component: 'VMS', reason: 'Scheduled', remarks: 'testing', url_path: 'https://abcd'
        },
        {
          SlNo: 13, rm_office: 'Coimbatore', dm_office: 'Thirunelveli', shop_number: '45001',
          from_date: '12/10/2020 10:00 AM', to_date: '13/10/2020 10:10 AM', type: 'Planned', camera_pos: 2,
          network: 'Up', location: 'Shop', component: '4G-NETWORK', reason: 'Scheduled', remarks: 'testing', url_path: 'https://abcd'
        },
        {
          SlNo: 14, rm_office: 'HeadOffice', dm_office: 'Coimbatore', shop_number: '44875',
          from_date: '10/10/2020 01:20 PM', to_date: '10/10/2020 05:10 PM', type: 'Unplanned',
          location: 'RM Office', component: 'VMS', reason: 'Incidental', remarks: 'testing', url_path: 'xxx'
        },
        {
          SlNo: 15, rm_office: 'Trichy', dm_office: 'Dindigul', shop_number: '448001',
          from_date: '02/10/2020 03:21 PM', to_date: '04/10/2020 05:10 PM', type: 'Planned', camera_pos: 2,
          network: 'Up', location: 'Shop', component: 'CAMERA', reason: 'Incidental', remarks: 'testing', url_path: 'yyyy'
        },
        {
          SlNo: 16, rm_office: 'Coimbatore', dm_office: 'Cuddalore', shop_number: '12456',
          from_date: '23/10/2020 11:21 AM', to_date: '25/10/2020 05:10 PM', type: 'Unplanned', camera_pos: 2,
          network: 'Up', location: 'Shop', component: '4G-NETWORK', reason: 'Scheduled', remarks: 'testing', url_path: 'zzzz'
        },
        {
          SlNo: 17, rm_office: 'HeadOffice', dm_office: 'Erode', shop_number: '784111',
          from_date: '22/10/2020 11:21 AM', to_date: '25/10/2020 05:10 PM', type: 'Planned', camera_pos: 2,
          network: 'Up', location: 'DM Office', component: 'UPS', reason: 'Accidental', remarks: 'testing', url_path: 'aaaa'
        },
        {
          SlNo: 18, rm_office: 'Coimbatore', dm_office: 'Dindigul', shop_number: '12456',
          from_date: '02/10/2020 11:21 AM', to_date: '05/10/2020 05:10 PM', type: 'Unplanned',
          location: 'DM Office', component: 'DM-VMS', reason: 'Scheduled', remarks: '', url_path: 'bbbb'
        },
        {
          SlNo: 19, rm_office: 'Trichy', dm_office: 'Salem', shop_number: '44457',
          from_date: '12/10/2020 11:00 AM', to_date: '13/10/2020 12:10 PM', type: 'Planned', camera_pos: 1,
          network: 'Down', location: 'DM Office', component: 'INTERNET', reason: 'Accidental', remarks: 'testing', url_path: 'xxxx'
        },
        {
          SlNo: 20, rm_office: 'Salem', dm_office: 'Chennai(North)', shop_number: '12456',
          from_date: '10/10/2020 02:21 PM', to_date: '15/10/2020 05:10 PM', type: 'Unplanned', camera_pos: 2,
          network: 'Up', location: 'Shop', component: 'CAMERA', reason: 'Scheduled', remarks: '', url_path: 'yyyy'
        },
        {
          SlNo: 21, rm_office: 'HeadOffice', dm_office: 'Chennai(North)', shop_number: '440001',
          from_date: '05/10/2020 10:21 AM', to_date: '07/10/2020 05:10 PM',
          type: 'Planned', location: 'RM Office', component: 'VMS', reason: 'Accidental', remarks: '-', url_path: 'https://abcd'
        },
        {
          SlNo: 22, rm_office: 'HeadOffice', dm_office: 'Chennai(South)', shop_number: '778450',
          from_date: '02/10/2020 11:21 AM', to_date: '05/10/2020 05:10 PM', type: 'Planned',
          location: 'Shop', component: 'UPS', reason: 'Non-Scheduled', remarks: 'testing', url_path: 'xxxx'
        },
      )
      if (this.nmsData.length !== 0) {
        if ((this.type * 1) === 1) {
          this.nmsData = this.nmsData.filter(x => {
            return x.type === 'Planned';
          })
        } else {
          this.nmsData = this.nmsData.filter(x => {
            return x.type === 'Unplanned';
          })
        }
        let sno = 1;
        this.nmsData.forEach(i => { i.SlNo = sno; sno += 1; });
      }
      // const params = new HttpParams().set('FDate', this.datepipe.transform(this.fromDate, 'dd/MM/yyyy hh:mm:ss a'))
      //   .append('TDate', this.datepipe.transform(this.toDate, 'dd/MM/yyyy hh:mm:ss a '));
      // this.restApiService.getByParameters(PathConstants.NMSGetURL, params).subscribe((res: any) => {
      //   if (res !== undefined && res !== null && res.length !== 0) {
      //     this.nmsData = res.filter(x => {
      //       return x.type === this.type;
      //     });
      //     let sno = 1;
      //     this.nmsData.forEach(i => { i.SlNo = sno; sno += 1; });
      //     this.loading = false;
      //   } else {
      //     this.loading = false;
      //     this.nmsData = [];
      //     this.messageService.clear();
      //     this.messageService.add({
      //       key: 't-err', severity: 'error',
      //       summary: 'Error Message', detail: 'No record found!'
      //     });
      //   }
      // }, (err: HttpErrorResponse) => {
      //   if (err.status === 0 || err.status === 400) {
      //     this.messageService.clear();
      //     this.messageService.add({
      //       key: 't-err', severity: 'error',
      //       summary: 'Error Message', detail: 'Please contact administrator!'
      //     });
      //   } else {
      //     this.messageService.clear();
      //     this.messageService.add({
      //       key: 't-err', severity: 'error',
      //       summary: 'Error Message', detail: 'Please check your network connection!'
      //     });
      //   }
      // });
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
