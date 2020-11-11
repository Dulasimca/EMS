import { Component, OnInit } from '@angular/core';
import { PathConstants } from 'src/app/Helper/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-bugzilla-report',
  templateUrl: './bugzilla-report.component.html',
  styleUrls: ['./bugzilla-report.component.css']
})
export class BugzillaReportComponent implements OnInit {
  bugzillaCols: any;
  bugzillaData: any;
  loading: boolean;
  
  constructor(private restApi: RestAPIService) { }

  ngOnInit() {
    this.bugzillaCols = [
      { header: 'S.No', field: 'SlNo', width: '40px' },
      { field: 'bug_id', header: 'Bug ID' },
      { field: 'bug_severity', header: 'Bug Severity' },
      { field: 'bug_status', header: 'Bug Status' },
      { field: 'assigned_to', header: 'Assigned To' },
      { field: 'short_desc', header: 'Description'},
      { field: 'creation_ts', header: 'Created Date' }
    ];
    this.loading = true;
    this.restApi.get(PathConstants.HMSReportURL).subscribe(data => {
      console.log('data', data.Table);
      let sno = 1;
      this.bugzillaData = data.Table;
      this.bugzillaData.forEach(x => {
        x.SlNo = sno;
        sno += 1;
      });
      this.bugzillaData.push(
        {
          SlNo: 5, bug_id: 12, bug_severity: 'enhancement', bug_status: 'ASSIGNED', assigned_to: 26, 
          short_desc: 'bug test', creation_ts: '2020-06-20T21:48:22'},
        {
        SlNo: 6, bug_id: 13, bug_severity: 'enhancement', bug_status: 'COMPLETED', assigned_to: 34, 
        short_desc: 'bug test', creation_ts: '2020-08-20T21:48:22'}
        )
      this.loading = false;
    });
  }

}
