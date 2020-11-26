import { Injectable } from '@angular/core';
import { PathConstants } from '../Helper/PathConstants';
import { RestAPIService } from '../services/restAPI.service';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  regions?: any;
  districts?: any;
  products?: any;
  shops?: any;

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

  getProducts() {
    this.products = [];
    this.restApiService.get(PathConstants.ProductsGetURL).subscribe(product => {
      product.forEach(p => {
        this.products.push({ 'name': p.name, 'id': p.id });
      })
    })
    return this.products;
  }

  getShops() {
    this.shops = [];
    this.restApiService.get(PathConstants.ShopsGetURL).subscribe(shop => {
      shop.forEach(s => {
        this.shops.push({ 'shop_num': s.SHOPNO, 'dcode': s.Dcode });
      })
    })
    return this.shops;
  }
}
