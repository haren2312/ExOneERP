import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthorizeService } from '../../../api-authorization/AuthorizeService';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../services/notification.service';
import { UtilityService } from '../../../services/utility.service';

@Component({
  selector: 'app-addupdate-notification',
  templateUrl: './addupdate-notification.component.html',
  styleUrls: []
})
export class AddupdateNotificationComponent implements OnInit {
  id: number = 0;
  row: any;
  form!: FormGroup;
  isArab: boolean = false;
  branchCodeList: Array<any> = [];
  gradeCodeList: Array<any> = [];
  nationalityList: Array<any> = [];
  sectionList: Array<any> = [];
  schoolPETCategoryList: Array<any> = [];
  genderList: Array<any> = [];
  mobileNumber: string = '';
  isApprovalLogin: boolean = false;
  isShowSave: boolean = true;

  constructor(private fb: FormBuilder, private apiService: ApiService,
    private authService: AuthorizeService, private utilService: UtilityService, public dialogRef: MatDialogRef<AddupdateNotificationComponent>,
    private notifyService: NotificationService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      'branchCode': ['', Validators.required],
      'gradeCode': ['', Validators.required],
      'nationalityCode': ['', Validators.required],
      'sectionCode': ['', Validators.required],
      'ptGroupCode': ['', Validators.required],
      'genderCode': ['', Validators.required],
      'pickUpAndDropZone': ['', Validators.required],
      'notificationTitle': ['', Validators.required],
      'notificationTitle_Ar': ['', Validators.required],
      'notificationMessage': ['', Validators.required],
      'notificationMessage_Ar': ['', Validators.required]
    });
    this.loadList();
    if (this.row) {
      this.id = this.row['id'];
      this.editNotification();
    }
  }
  loadList() {
    this.apiService.getall('schoolBranches/getSchoolBranchList').subscribe(res => {
      this.branchCodeList = res;
    });
    this.apiService.getPagination('acedemicClassGrade', this.utilService.getQueryString(0, 1000, '', '')).subscribe(res => {
      if (res)
        this.gradeCodeList = res['items'];
    });
    this.apiService.getPagination('schoolNational', this.utilService.getQueryString(0, 1000, '', '')).subscribe(res => {
      if (res)
        this.nationalityList = res['items'];
    });
    this.apiService.getPagination('schoolPETCategory', this.utilService.getQueryString(0, 1000, '', '')).subscribe(res => {
      if (res)
        this.schoolPETCategoryList = res['items'];
    });
    this.apiService.getPagination('schoolGender', this.utilService.getQueryString(0, 1000, '', '')).subscribe(res => {
      if (res)
        this.genderList = res['items'];
    });
  }
  loadRelatedItems() {
    const gradeCode: string = this.form.value['gradeCode'] as string;
    if (gradeCode != null && gradeCode != '') {
      this.apiService.getall(`SchoolGradeSectionMapping/getAllSectionsByGradeCode/${gradeCode}`).subscribe(res => {
        if (res)
          this.sectionList = res;
      });
    }
  }
  reset() {
    this.form.reset();
  }
  approveEvent() {
    this.form.value['id'] = this.id;
    this.form.value['notificationType'] = 3;
    this.apiService.post('WebNotification/BulkWebNotificationApproval', this.form.value)
      .subscribe(res => {
        this.utilService.OkMessage();
        this.dialogRef.close(true);
      },
        error => {
          console.error(error);
          this.utilService.ShowApiErrorMessage(error);
        });
  }
  closeModel() {
    this.dialogRef.close();
  }
  editNotification() {
    this.apiService.getall(`WebNotification/GetNotificationById/${this.id}`).subscribe(res => {
      if (res) {
        if (res.isApproved) {
          this.isShowSave = false;
        } else {
          this.apiService.get('TeacherMaster/IsApprovalLoginTeacher', 4).subscribe(res => {
            if (res) {
              this.isApprovalLogin = res;
            }
          });
        }
        this.id = res.id;
        this.form.patchValue({
          'branchCode': res.branchCode,
          'gradeCode': res.gradeCode,
          'nationalityCode': res.nationalityCode,
          'sectionCode': res.sectionCode,
          'ptGroupCode': res.ptGroupCode,
          'genderCode': res.genderCode,
          'pickUpAndDropZone': res.pickUpAndDropZone,
          'notificationTitle': res.notificationTitle,
          'notificationTitle_Ar': res.notificationTitle_Ar,
          'notificationMessage': res.notificationMessage,
          'notificationMessage_Ar': res.notificationMessage_Ar
        });
        this.loadRelatedItems();
      }
    });
  }
  submit() {
    if (this.form.valid) {
      this.form.value['id'] = this.id;
      this.form.value['notificationType'] = 3;
      this.apiService.post('WebNotification/CreateNotification', this.form.value)
        .subscribe(res => {
          this.utilService.OkMessage();
          this.reset();
          this.dialogRef.close(true);
        },
          error => {
            console.error(error);
            this.utilService.ShowApiErrorMessage(error);
          });
    }
    else
      this.utilService.FillUpFields();
  }
}