import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthorizeService } from 'src/app/api-authorization/AuthorizeService';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DBOperation } from 'src/app/services/utility.constants';
import { UtilityService } from 'src/app/services/utility.service';
import { ParentHrmAdminComponent } from 'src/app/sharedcomponent/ParentHrmAdmin.component';
import { ValidationService } from 'src/app/sharedcomponent/ValidationService';

@Component({
  selector: 'app-addupdategrade',
  templateUrl: './addupdategrade.component.html',
  styles: [
  ]
})
export class AddupdategradeComponent extends ParentHrmAdminComponent implements OnInit {
  modalTitle!: string;
  modalBtnTitle!: string;
  dbops!: DBOperation;
  form!: FormGroup;
  id: number = 0;
  isReadOnly: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService,
    private authService: AuthorizeService, private utilService: UtilityService, public dialogRef: MatDialogRef<AddupdategradeComponent>,
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
        'gradeCode': ['', Validators.required],
        'gradeNameEn': ['', Validators.required],
        'gradeNameAr': [''],
        'isActive': [false],
      }
    );
    this.isReadOnly = false;
  }
  setEditForm() {
    this.apiService.get('Grade', this.id).subscribe(res => {
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
      this.apiService.post('Grade', this.form.value)
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
    this.form.controls['gradeCode'].setValue('');
    this.form.controls['gradeNameEn'].setValue('');
    this.form.controls['gradeNameAr'].setValue('');
    this.form.controls['isActive'].setValue('');
  }
}
