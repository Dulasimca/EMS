import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';

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

  constructor(private messageService: MessageService, private datepipe: DatePipe,
    private restApiService: RestAPIService) { }

  ngOnInit() {
    this.nmsCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'dm_office', header: 'DM Office' },
      { field: 'shop_number', header: 'Shop Number' },
      { field: 'type', header: 'Type' },
      { field: 'camera_pos', header: 'Camera Position' },
      { field: 'network', header: 'Network' },
      { field: 'reason', header: 'Reason' },
      { field: 'remarks', header: 'Remarks' },
      { field: 'url', header: 'URL' }
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
          SlNo: 1, dm_office: 'Dindigul', shop_number: '12456', type: 'Unplanned', camera_pos: 1,
          network: 'Up', reason: 'Scheduled', remarks: 'testing', url: 'https://abcd'
        },
        {
          SlNo: 2, dm_office: 'Cuddalore', shop_number: '456001', type: 'Planned', camera_pos: 2,
          network: 'Down', reason: 'Non-Scheduled', remarks: '', url: 'https://jhdj.in'
        },
        {
          SlNo: 3, dm_office: 'Erode', shop_number: '772106', type: 'Unplanned', camera_pos: 1,
          network: 'Up', reason: 'Scheduled', remarks: '', url: 'https://www.google.com'
        },
        {
          SlNo: 4, dm_office: 'Namakkal', shop_number: '80457', type: 'Planned', camera_pos: 1,
          network: 'Up', reason: 'Accidental', remarks: 'testing', url: 'https://abcd'
        },
        {
          SlNo: 5, dm_office: 'Dindigul', shop_number: '40056', type: 'Unplanned', camera_pos: 2,
          network: 'Down', reason: 'Incidental', remarks: 'testing 1', url: 'https://yyt.in'
        },
        {
          SlNo: 6, dm_office: 'Trichy', shop_number: '75456', type: 'Unplanned', camera_pos: 1,
          network: 'Up', reason: 'Scheduled', remarks: 'testing 2', url: 'https://qqq.com'
        },
        {
          SlNo: 7, dm_office: 'Vellore', shop_number: '20156', type: 'Planned', camera_pos: 1,
          network: 'Down', reason: 'Non-Scheduled', remarks: '', url: 'https://pss.com'
        },
        {
          SlNo: 8, dm_office: 'Villipuram', shop_number: '45475', type: 'Unplanned', camera_pos: 2,
          network: 'Up', reason: 'Incidental', remarks: 'testing 3', url: 'https://trt.in'
        },
        {
          SlNo: 9, dm_office: 'Salem', shop_number: '45784', type: 'Planned', camera_pos: 1,
          network: 'Down', reason: 'Scheduled', remarks: '', url: 'https://testing.com'
        },
        {
          SlNo: 10, dm_office: 'Thirunelveli', shop_number: '12407', type: 'Unplanned', camera_pos: 1,
          network: 'Up', reason: 'Scheduled', remarks: 'testing', url: 'https://www.test.com'
        },
        {
          SlNo: 11, dm_office: 'Coimbatore', shop_number: '78740', type: 'Planned', camera_pos: 2,
          network: 'Down', reason: 'Non-Scheduled', remarks: 'testing', url: 'https://abcd'
        },
        {
          SlNo: 12, dm_office: 'Salem', shop_number: '548700', type: 'Unplanned', camera_pos: 1,
          network: 'Up', reason: 'Scheduled', remarks: 'testing', url: 'https://abcd'
        },
        {
          SlNo: 13, dm_office: 'Thirunelveli', shop_number: '45001', type: 'Planned', camera_pos: 2,
          network: 'Up', reason: 'Scheduled', remarks: 'testing', url: 'https://abcd'
        },
        {
          SlNo: 14, dm_office: 'Coimbatore', shop_number: '44875', type: 'Unplanned', camera_pos: 1,
          network: 'Up', reason: 'Incidental', remarks: 'testing', url: 'xxx'
        },
        {
          SlNo: 15, dm_office: 'Dindigul', shop_number: '448001', type: 'Planned', camera_pos: 2,
          network: 'Up', reason: 'Incidental', remarks: 'testing', url: 'yyyy'
        },
        {
          SlNo: 16, dm_office: 'Cuddalore', shop_number: '12456', type: 'Unplanned', camera_pos: 2,
          network: 'Up', reason: 'Scheduled', remarks: 'testing', url: 'zzzz'
        },
        {
          SlNo: 17, dm_office: 'Erode', shop_number: '784111', type: 'Planned', camera_pos: 2,
          network: 'Up', reason: 'Accidental', remarks: 'testing', url: 'aaaa'
        },
        {
          SlNo: 18, dm_office: 'Dindigul', shop_number: '12456', type: 'Unplanned', camera_pos: 1,
          network: 'Up', reason: 'Scheduled', remarks: '', url: 'bbbb'
        },
        {
          SlNo: 19, dm_office: 'Salem', shop_number: '44457', type: 'Planned', camera_pos: 1,
          network: 'Down', reason: 'Accidental', remarks: 'testing', url: 'xxxx'
        },
        {
          SlNo: 20, dm_office: 'Chennai(North)', shop_number: '12456', type: 'Unplanned', camera_pos: 2,
          network: 'Up', reason: 'Scheduled', remarks: '', url: 'yyyy'
        },
        {
          SlNo: 21, dm_office: 'Chennai(North)', shop_number: '440001', type: 'Planned', camera_pos: 1,
          network: 'Up', reason: 'Accidental', remarks: '', url: 'https://abcd'
        },
        {
          SlNo: 22, dm_office: 'Chennai(South)', shop_number: '778450', type: 'Planned', camera_pos: 1,
          network: 'Down', reason: 'Non-Scheduled', remarks: 'testing', url: 'xxxx'
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

}
