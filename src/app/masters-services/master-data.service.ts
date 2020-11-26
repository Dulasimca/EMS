import { Injectable } from '@angular/core';
import { PathConstants } from '../Helper/PathConstants';
import { RestAPIService } from '../services/restAPI.service';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  regions?: any;
  districts?: any;

  constructor(private restApiService: RestAPIService) { }

  getRegions() {
    this.regions = [];
    this.restApiService.get(PathConstants.RegionMasterURL).subscribe(reg => {
      reg.forEach(r => {
        this.regions.push({ 'name': r.REGNNAME, 'code': r.REGNCODE });
      })
    })
    return this.regions;
  }

  getDistricts() {
    this.districts = [];
    this.restApiService.get(PathConstants.DistrictMasterURL).subscribe(dist => {
      dist.forEach(d => {
        this.districts.push({ 'name': d.Dname, 'code': d.Dcode, 'rcode': d.Rcode });
      })
    })
    return this.districts;
  }
}
