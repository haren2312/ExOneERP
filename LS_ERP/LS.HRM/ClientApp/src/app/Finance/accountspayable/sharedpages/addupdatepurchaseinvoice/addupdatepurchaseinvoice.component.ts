import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthorizeService } from '../../../../api-authorization/AuthorizeService';
import { NotificationService } from '../../../../services/notification.service';
import { ValidationService } from '../../../../sharedcomponent/ValidationService';
import { UtilityService } from '../../../../services/utility.service';
import { ApiService } from '../../../../services/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomSelectListItem, LanCustomSelectListItem } from '../../../../models/MenuItemListDto';
import { from, Observable } from 'rxjs';
import { CommonService } from '../../../../services/common.service';
import { DBOperation } from '../../../../services/utility.constants';
//import * as $ from 'jquery';
//import { $ } from 'jquery';

@Component({
  selector: 'app-addupdatepurchaseinvoice',
  templateUrl: './addupdatepurchaseinvoice.component.html',
  styles: [
  ]
})
export class AddupdatepurchaseinvoiceComponent implements OnInit {

  form: FormGroup;
  modalTitle: string;
  id: number = 0;

  customerList: Array<LanCustomSelectListItem> = [];
  companyList: Array<CustomSelectListItem> = [];
  paymentTermsList: Array<CustomSelectListItem> = [];
  branchList: Array<CustomSelectListItem> = [];
  productList: Array<CustomSelectListItem> = [];
  vatList: Array<CustomSelectListItem> = [];
  segmentSetupList: Array<CustomSelectListItem> = [];
  segmentTwoSetupList: Array<CustomSelectListItem> = [];

  productId: number = 0;
  quantity: number = 0;
  price: number = 0;
  vat: number = 0;
  vatAmount: number = 0;
  total: number = 0;
  discount: number = 0;
  discountAmount: number = 0;
  unitType: string = '';
  description: string = '';
  product: string = '';

  grandDiscountAmount: number = 0;
  grandTotal: number = 0;
  grandVatTotal: number = 0;
  grandInvoiceTotal: number = 0;
  grandTotalStr: string = '';
  grandVatTotalStr: string = '';
  grandInvoiceTotalStr: string = '';


  sequence: number = 1;
  editsequence: number = 0;
  listOfInvoices: Array<any> = [];

  canShowNotes: boolean = false;
  canShowRemarks: boolean = false;
  invoiceItemObject: any;
  isArab: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private apiService: ApiService,
    private authService: AuthorizeService, private utilService: UtilityService, public dialogRef: MatDialogRef<AddupdatepurchaseinvoiceComponent>,
    private notifyService: NotificationService, private validationService: ValidationService, private commonService: CommonService) {

  }

  ngOnInit(): void {
    this.isArab = this.utilService.isArabic();
    //let $: any;
    //$('.select2').select2();
    this.setForm();
    this.loadData();
    // this.paymentTermsList.push({ text: 'first payment', value: '1' });
  }
  setForm() {
    //let cDate: IMyDateModel = { isRange: false, singleDate: {}, dateRange: null };
    this.form = this.fb.group({
      'customerId': ['', Validators.required],
      'invoiceDate': ['', Validators.required],
      'invoiceDueDate': ['', Validators.required],
      'serviceDate1': ['', Validators.required],
      'companyId': ['', Validators.required],
      'branchCode': ['', Validators.required],
      'invoiceRefNumber': ['', Validators.required],
      //'docNum': ['', Validators.required],
      'lpoContract': ['', Validators.required],
      'paymentTermId': ['', Validators.required],
      'taxIdNumber': ['', Validators.required],
      'remarks': [''],
      'invoiceNotes': [''],
      'invoiceStatusId': ['1'],
      'seg1': [''],
      'seg2': [''],
      //'': ['', Validators.required],
      //'': ['', Validators.required],

    });

  }


  loadData() {

    // this.productList = [{ text: 'product One', value: '1' }, { text: 'product Two', value: '2' }]

    this.apiService.getall("vat/getSelectVatList").subscribe(res => {
      if (res)
        this.vatList = res;
    });

    this.apiService.getall("product/getSelectProductList").subscribe(res => {
      if (res)
        this.productList = res;
    });

    this.apiService.getall("vendor/getVendorsCustomList").subscribe(res => {
      if (res) {
        this.customerList = res;
        const newList = this.customerList.map((i) => {
          i.text = !this.isArab ? i.text : i.textTwo;
          return i;
        });
      }
    });
    this.apiService.getall("company/getSelectCompanyList").subscribe(res => {
      if (res)
        this.companyList = res;
    });

    this.apiService.getall("poTermsCode/getSelectPoTermsCodeList").subscribe(res => {
      if (res)
        this.paymentTermsList = res;
    });

    this.apiService.getall("segmentSetup/getSegmentSetupSelectList").subscribe(res => {
      if (res)
        this.segmentSetupList = res;
    });
    this.apiService.getall("segmentTwoSetup/getSegmentTwoSetupSelectList").subscribe(res => {
      if (res)
        this.segmentTwoSetupList = res;

    });
  }

  customerChange(event: any) {
    let vendId = event.value;
    this.apiService.getall(`vendor/getVendorById/${vendId}`).subscribe(res => {
      if (res) {
        this.form.controls['taxIdNumber'].setValue(res['vatNumber'])
      }
    });
  }

  loadBranchs(event: any) {
    let comId = event.target.value;
    if (comId) {
      this.apiService.getall(`branch/getSelectSysAccountBranchList`).subscribe(res => {
        if (res)
          this.branchList = res;
      });
    }
  }

  resetProduct() {
    this.product = '';
    this.unitType = '';
    this.description = '';
    this.price = 0;
    this.total = 0;
    this.discount = 0;
    this.discountAmount = 0;
    this.quantity = 0;
  }

  loadProductdata(event: any) {
    let prodictId = event.value, productName = event.text;
    if (prodictId) {

      this.apiService.getall(`product/productUnitPriceItem/${prodictId}`).subscribe(res => {
        if (res) {
          this.product = res.nameEN;
          this.unitType = res.unitTypeEN;
          this.description = res.description;
          this.price = res.unitPrice;
        }
        //this.branchList = res;
      });
    }
    else {
      this.unitType = '';
      this.description = '';
    }
  }


  //addInvoice() {
  //  if (this.total != 0 && this.productId > 0) {
  //    if (this.editsequence > 0) {
  //      this.removeInvoiceList(this.editsequence);
  //      //let index: number = this.listOfInvoices.findIndex(a => a.sequence === this.editsequence);
  //      //this.listOfInvoices.splice(index, 1);
  //      this.editsequence = 0;
  //    }
  //    this.listOfInvoices.push({
  //      sequence: this.getSequence(),
  //      product: this.product, productId: this.productId, description: this.description, quantity: this.quantity, unitType: this.unitType, unitPrice: this.price,
  //      taxTariffPercentage: this.vat, taxAmount: this.vatAmount, totalAmount: this.total,
  //      discount: this.discount, discountAmount: this.discountAmount
  //    });
  //    //this.setLabelPrices(this.total, this.vatAmount, '');
  //    this.setGrandTotal();
  //    this.setToDefault();
  //  }
  //}


  addInvoice() {
    if (this.total != 0 && this.productId > 0) {
      if (this.editsequence > 0) {

        var index: number = this.listOfInvoices.findIndex(a => a.sequence === this.editsequence);

        let pItem = this.listOfInvoices[index];
        pItem.sequence = this.editsequence;
        pItem.product = this.product;
        pItem.productId = this.productId;
        pItem.description = this.description;
        pItem.quantity = this.quantity;
        pItem.unitType = this.unitType;
        pItem.unitPrice = this.price;
        pItem.taxTariffPercentage = this.vat;
        pItem.taxAmount = this.vatAmount;
        pItem.totalAmount = this.total;
        pItem.discount = this.discount;
        pItem.discountAmount = this.discountAmount;

        this.editsequence = 0;
      }
      else {
        this.listOfInvoices.push({
          sequence: this.getSequence(),
          product: this.product, productId: this.productId, description: this.description, quantity: this.quantity, unitType: this.unitType, unitPrice: this.price,
          taxTariffPercentage: this.vat, taxAmount: this.vatAmount, totalAmount: this.total,
          discount: this.discount, discountAmount: this.discountAmount
        });
      }
      //this.setLabelPrices(this.total, this.vatAmount, '');
      this.setGrandTotal();
      this.setToDefault();
    }
  }


  getSequence(): number { return this.sequence += this.sequence + 1 };

  showCanShowNotes() { this.canShowNotes = !this.canShowNotes }
  showCanShowRemarks() { this.canShowRemarks = !this.canShowRemarks }

  deleteInvoiceItem(item: any) {
    this.removeInvoiceList(item.sequence);
    this.setGrandTotal();
  }

  removeInvoiceList(sequence: number) {
    let index: number = this.listOfInvoices.findIndex(a => a.sequence === sequence);
    this.listOfInvoices.splice(index, 1);
  }

  editInvoiceItem(item: any) {
    this.editsequence = item.sequence,
      this.product = item.product;
    this.productId = item.productId;
    this.description = item.description;
    this.quantity = item.quantity;
    this.unitType = item.unitType;
    this.price = item.unitPrice; this.vat = item.taxTariffPercentage; this.vatAmount = item.taxAmount; this.total = item.totalAmount;
    this.discount = item.discount;
    this.discountAmount = item.discountAmount;
  }

  setGrandTotal() {
    this.grandTotal = 0;
    this.grandVatTotal = 0;
    this.grandInvoiceTotal = 0;
    this.grandDiscountAmount = 0;

    this.listOfInvoices.forEach(inv => {
      this.grandTotal += inv.totalAmount;
      this.grandVatTotal += inv.taxAmount;
      this.grandInvoiceTotal += (inv.totalAmount - inv.taxAmount);
      this.grandDiscountAmount += inv.discountAmount;
    });

    this.form.value['totalAmount'] = this.grandTotal;
    this.form.value['discountAmount'] = this.grandDiscountAmount;
    this.form.value['taxAmount'] = this.grandVatTotal;
    this.form.value['subTotal'] = this.grandInvoiceTotal;

    this.grandTotalStr = this.grandTotal.toString();
    this.grandVatTotalStr = this.grandVatTotal.toString();
    this.grandInvoiceTotalStr = this.grandInvoiceTotal.toString();
  }

  //setLabelPrices(total: number, vatAmount: number, operation: string) {
  //  this.grandTotal += total;
  //  this.grandVatTotal += vatAmount;
  //  this.grandInvoiceTotal += (total - vatAmount);

  //  this.grandTotalStr = this.grandTotal.toString();
  //  this.grandVatTotalStr = this.grandVatTotal.toString();
  //  this.grandInvoiceTotalStr = this.grandInvoiceTotal.toString();
  //}

  setToDefault() {
    this.productId = 0;
    this.product = this.description = this.unitType = '';
    this.quantity = this.price = this.vat = this.vatAmount = this.total = this.discount = this.discountAmount = 0;
  }

  calculate() {

    var itemvat = parseFloat(this.vat.toString());
    if (this.discount > 100) {
      this.discount = 0;
    }

    var discount = this.discount;
    var qty = this.quantity;
    var price = this.price;

    var amount = parseFloat((qty * price).toString())
    var discountPrice = parseFloat(((amount * discount) / 100).toFixed(2));
    amount = parseFloat((amount - discountPrice).toString());

    this.discountAmount = discountPrice;
    this.vatAmount = parseFloat(((amount * itemvat) / 100).toFixed(2));
    this.total = parseFloat(this.vatAmount.toString()) + parseFloat(amount.toString());

    // this.setLabelPrices(this.total, this.vatAmount, '');
  }


  submit() {

    //this.invoiceItemObject = {
    //  item: {},
    //  itemList: this.listOfInvoices
    //};

    this.form.value['invoiceDate'] = this.utilService.selectedDateTime(this.form.controls['invoiceDate'].value);
    this.form.value['invoiceDueDate'] = this.utilService.selectedDateTime(this.form.controls['invoiceDueDate'].value);


    if (this.form.valid) {
      //if (this.id > 0)
      //  this.form.value['id'] = this.id;
      if (this.listOfInvoices.length > 0) {
        this.form.value['itemList'] = this.listOfInvoices;

        this.apiService.post('generateApInvoice', this.form.value)
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
        this.notifyService.showError("Items Empty");
    }
    else
      this.utilService.FillUpFields();

  }
  reset() {
    this.form.reset();
  }
  closeModel() {
    this.dialogRef.close();
  }

}