import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthorizeService } from '../../../../api-authorization/AuthorizeService';
import { ApiService } from '../../../../services/api.service';
import { NotificationService } from '../../../../services/notification.service';
import { UtilityService } from '../../../../services/utility.service';


@Component({
  selector: 'app-bvprint',
  templateUrl: './bvprint.component.html',
  styles: [
  ]
})
export class BvprintComponent implements OnInit {

  id: number = 0;
  printItem: any;
  user: string = '';
  constructor(private apiService: ApiService,
    private authService: AuthorizeService, public utilService: UtilityService, public dialogRef: MatDialogRef<BvprintComponent>,
    private notifyService: NotificationService) {

  }

  ngOnInit(): void {
    this.user = this.authService.getUserName();
    this.loadData();
  }


  loadData() {

    this.apiService.getall(`bankVoucher/bankVoucherPrint/${this.id}`).subscribe(res => {
      if (res)
        this.printItem = res as any;
    });
  }

  printInvoice() {
    this.openPrint();
  }

  openPrint() {
    const printContent = document.getElementById("printcontainer") as HTMLElement;    
    this.utilService.printForLocale(printContent);   
    

  }

  closeModel() {
    this.dialogRef.close();
  }

}