import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from '../Helper/PathConstants';
import { RestAPIService } from '../services/restAPI.service';

@Component({
  selector: 'app-nms-sla-form',
  templateUrl: './nms-sla-form.component.html',
  styleUrls: ['./nms-sla-form.component.css']
})
export class NMSSLAFormComponent implements OnInit {
  selectedCameraPos: any = '1';
  selectedNetwork: any = 2;
  shopCode: any;
  regionOptions: SelectItem[];
  rcode: string;
  // networkDownTime: string;
  // networkUpTime: string;
  // plannedDownTime: string;
  // duration: string;
  reasonOptions: SelectItem[];
  reason: string;
  remarksTxt: string;
  selectedType: any = 1;
  maxDate: Date = new Date();
  fromDate: any;
  toDate: any;
  urlPath: string;
  regionsData: any = [];

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe, private messageService: MessageService) { }

  ngOnInit() {
    this.reasonOptions = [
      { label: '-select-', value: null },
      { label: 'Scheduled', value: 1 }, { label: 'Non Scheduled', value: 2},
      { label: 'Accidental', value: 3}, { label: 'Incidental', value: 4}
    ];
  }

  onSelectRegions() {
    if(this.regionOptions === undefined) {
    this.restApiService.get(PathConstants.RegionMasterURL).subscribe((res: any) => {
      res.forEach(x => {
          this.regionsData.push({ 'label': x.REGNNAME, 'value': x.REGNCODE });
      });
    this.regionOptions = this.regionsData;
    this.regionOptions.unshift({ label: '-select-', value: null });
  })
  }
}

onFileUpload(event ) {
console.log('eve', event);
if (event.target.files && event.target.files[0]) {
  var reader = new FileReader();
  reader.onload = (event: any) => {
      console.log('url', event.target.result);
  }
  reader.readAsDataURL(event.target.files[0]);
}
}

onSave() {
  const params = {
    'RCode': this.rcode,
    'SLAType': this.selectedType,
    'Network': this.selectedNetwork,
    'CameraPos': (this.selectedCameraPos * 1),
    'ShopNumber': this.shopCode,
    'FromDate': this.datepipe.transform(this.fromDate, 'dd/MM/yyyy h:mm:ss a'),
    'ToDate': this.datepipe.transform(this.toDate, 'dd/MM/yyyy h:mm:ss a'),
    'Reason': this.reason,
    'Remarks': this.remarksTxt,
    'URLPath': this.urlPath
  }
  this.restApiService.post(PathConstants.NMSPostURL, params).subscribe(res => {
      if (res.item1) {
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: res.item2
        });
      }
  }, (err: HttpErrorResponse) => {
    if (err.status === 0 || err.status === 400) {
      this.messageService.clear();
      this.messageService.add({
        key: 't-err', severity: 'error',
        summary: 'Error Message', detail: 'Please Contact Administrator!'
      });
}

});
}
}
