import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from '../Helper/PathConstants';
import { MasterDataService } from '../masters-services/master-data.service';
import { RestAPIService } from '../services/restAPI.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-nms-sla-form',
  templateUrl: './nms-sla-form.component.html',
  styleUrls: ['./nms-sla-form.component.css']
})
export class NMSSLAFormComponent implements OnInit {
  shopCode: any;
  regionOptions: SelectItem[];
  rcode: string;
  districtOptions: SelectItem[];
  dcode: string;
  locationOptions: SelectItem[];
  location: string;
  componentOptions: SelectItem[];
  compId: string;
  bug_id: number;
  closed_date: string;
  reasonOptions: SelectItem[];
  reason: string;
  remarksTxt: string;
  selectedType: any = 1;
  maxDate: Date = new Date();
  fromDate: any;
  toDate: any;
  urlPath: string;
  regionsData: any = [];
  componentsData: any = [];
  districtsData: any = [];
  showCloseDate: boolean;
  isLocationSelected: boolean;
  disableShop: boolean;
  blockScreen: boolean;

  constructor(private restApiService: RestAPIService, private datepipe: DatePipe,
    private messageService: MessageService, private masterDataService: MasterDataService) { }

  ngOnInit() {
    this.showCloseDate = false;
    this.districtsData = this.masterDataService.getDistricts();
    this.regionsData = this.masterDataService.getRegions();
    this.reasonOptions = [
      { label: '-select-', value: null },
      { label: 'Scheduled', value: 1 }, { label: 'Non Scheduled', value: 2 },
      { label: 'Accidental', value: 3 }, { label: 'Incidental', value: 4 }
    ];
    this.locationOptions = [
      { label: '-select-', value: null },
      { label: 'RM-Office', value: 'R' }, { label: 'DM-Office', value: 'D' },
      { label: 'Shop', value: 'S' }
    ];
  }

  onSelect(type) {
    let regionSelection = [];
    let districtSeletion = [];
    switch (type) {
      case 'R':
        if (this.regionsData.length !== 0) {
          this.regionsData.forEach(r => {
            regionSelection.push({ label: r.name, value: r.code });
          })
          this.regionOptions = regionSelection;
          this.regionOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'D':
        if (this.districtsData.length !== 0) {
          this.districtsData.forEach(d => {
            if(this.rcode === d.rcode) {
            districtSeletion.push({ label: d.name, value: d.code });
            }
          })
          this.districtOptions = districtSeletion;
          this.districtOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'L':
        this.componentsData = [];
        this.restApiService.get(PathConstants.ComponentsURL).subscribe((res: any) => {
          res.forEach(x => {
            if (this.location === 'R' && x.product_id === 3) {
              this.componentsData.push({ 'label': x.name, 'value': x.id });
              this.disableShop = true;
            } else if (this.location === 'D' && x.product_id === 4) {
              this.componentsData.push({ 'label': x.name, 'value': x.id });
            } else if (this.location === 'S' && x.product_id === 5) {
              this.componentsData.push({ 'label': x.name, 'value': x.id });
            }
          });
          this.componentOptions = this.componentsData;
          this.componentOptions.unshift({ label: '-select-', value: null });
        })
        break;
    }
  }

  onFileUpload(event) {
    console.log('eve', event);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        console.log('url', event.target.result);
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onResetFields(field) {
    if(field === 'RM') {
      this.dcode = null;
    }
  }

  onSave(form: NgForm) {
    this.blockScreen = true;
    const params = {
      'RCode': this.rcode,
      'DCode': this.dcode,
      'Location': this.location,
      'Component': this.compId,
      'BugId': 0,
      'ClosedDate': (this.showCloseDate) ? this.closed_date : '-',
      'SLAType': this.selectedType,
      'ShopNumber': (this.shopCode !== undefined && this.shopCode !== null) ? this.shopCode : '-',
      'FromDate': this.datepipe.transform(this.fromDate, 'dd/MM/yyyy h:mm:ss a'),
      'ToDate': this.datepipe.transform(this.toDate, 'dd/MM/yyyy h:mm:ss a'),
      'Reason': this.reason,
      'Remarks': this.remarksTxt,
      'URLPath': this.urlPath
    }
    this.restApiService.post(PathConstants.NMSPostURL, params).subscribe(res => {
      if (res.item1) {
        this.blockScreen = false;
        form.reset();
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'success',
          summary: 'Success Message', detail: 'Saved Successfully !'
        });
      } else {
        this.blockScreen = false;
        this.messageService.clear();
        this.messageService.add({
          key: 't-err', severity: 'error',
          summary: 'Error Message', detail: res.item2
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockScreen = false;
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
