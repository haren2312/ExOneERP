import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthorizeService } from '../../../../api-authorization/AuthorizeService';
import { ApiService } from '../../../../services/api.service';
import { NotificationService } from '../../../../services/notification.service';
import { DBOperation } from '../../../../services/utility.constants';
import { UtilityService } from '../../../../services/utility.service';
import { ParentHrmAdminComponent } from '../../../../sharedcomponent/ParentHrmAdmin.component';
import { ValidationService } from '../../../../sharedcomponent/ValidationService';

@Component({
  selector: 'app-addupdatebanks',
  templateUrl: './addupdatebanks.component.html',
  styles: [
  ]
})
export class AddupdatebanksComponent extends ParentHrmAdminComponent implements OnInit {
  modalTitle: string;
  modalBtnTitle: string;
  dbops: DBOperation;
  form: FormGroup;
  id: number = 0;
  isReadOnly: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService,
    private authService: AuthorizeService, private utilService: UtilityService, public dialogRef: MatDialogRef<AddupdatebanksComponent>,
    private notifyService: NotificationService, private validationService: ValidationService) {
    super(authService)
  };


  ngOnInit(): void {
    this.setForm();
    if (this.id > 0)
      this.setEditForm();
  }

  setForm() {
    this.form = this.fb.group(
      {
        'bankCode': ['', Validators.required],
        'bankNameEn': ['', Validators.required],
        'bankNameAr': [''],
        'isActive': [false],
      }
    );
    this.isReadOnly = false;
  }
  setEditForm() {
    this.apiService.get('Bank', this.id).subscribe(res => {
      if (res) {
        this.isReadOnly = true;
        this.form.patchValue(res);
      }
    });
  }
  closeModel() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.valid) {
      if (this.id > 0)
        this.form.value['id'] = this.id;
      this.apiService.post('Bank', this.form.value)
        .subscribe(res => {
          this.utilService.OkMessage();
          this.reset();
          this.dialogRef.close(true);
        },
          error => {
            this.utilService.ShowApiErrorMessage(error);
          });
    }
    else
      this.utilService.FillUpFields();
  }

  reset() {
    this.form.controls['bankCode'].setValue('');
    this.form.controls['bankNameEn'].setValue('');
    this.form.controls['bankNameAr'].setValue('');
    this.form.controls['isActive'].setValue('');
  }
}