import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../../services/notification.service';
import { ParentOptMgtComponent } from '../../../sharedcomponent/parentoptmgt.component';
import { ApiService } from '../../../services/api.service';
import { UtilityService } from '../../../services/utility.service';
import { OprServicesService } from '../../opr-services.service';
import { ValidationService } from '../../../sharedcomponent/ValidationService';
import { AuthorizeService } from '../../../api-authorization/AuthorizeService';
import { PaginationService } from '../../../sharedcomponent/pagination.service';
import { DBOperation } from '../../../services/utility.constants';
import { CreateUpdateContractFormTemplateComponent } from '../create-update-contract-form-template/create-update-contract-form-template.component';
import { DeleteConfirmDialogComponent } from '../../../sharedcomponent/delete-confirm-dialog';
import { CreateUpdateContractFormElementsComponent } from './create-update-contract-form-elements/create-update-contract-form-elements.component';

@Component({
  selector: 'app-contract-form-elements',
  templateUrl: './contract-form-elements.component.html'
})
export class ContractFormElementsComponent extends ParentOptMgtComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayedColumns: string[] = ['clauseTitleEng', 'clauseSubTitleEng','clauseTitleArb', 'clauseSubTitleArb', 'Actions'];
  data: MatTableDataSource<any>;
  totalItemsCount: number;
  searchValue: string = '';
  sortingOrder: string = 'id desc';
  isLoading: boolean = false;
  form: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private apiService: ApiService, private authService: AuthorizeService,
    private notifyService: NotificationService, private utilService: UtilityService, private validationService: ValidationService, public dialog: MatDialog,
    public pageService: PaginationService, private oprService: OprServicesService, private translate: TranslateService) {
    super(authService);
  }

  ngOnInit(): void {
    this.initialLoading();
  }

  refresh() {
    this.searchValue = '';
    this.initialLoading();
  }

  initialLoading() {
    this.loadList(0, this.pageService.pageCount, "", this.sortingOrder);
  }

  onSortOrder(sort: any) {
    this.totalItemsCount = 0;
    this.sortingOrder = sort.active + ' ' + sort.direction;
    this.loadList(0, this.pageService.pageCount, "", this.sortingOrder);
  }


  onPageSwitch(event: PageEvent) {
    this.pageService.change(event);
    this.loadList(event.pageIndex, event.pageSize, "", this.sortingOrder);
  }

  private loadList(page: number | undefined, pageCount: number | undefined, query: string | null | undefined, orderBy: string | null | undefined) {
    this.isLoading = true;
    this.apiService.getPagination('ContractFormTemplateElements/getContractFormTemplateElementsPagedList', this.utilService.getQueryString(page, pageCount, query, orderBy)).subscribe(result => {
      this.totalItemsCount = 0;

      this.data = new MatTableDataSource(result.items);
      this.totalItemsCount = result.totalCount

      setTimeout(() => {
        this.paginator.pageIndex = page as number;
        this.paginator.length = this.totalItemsCount;
      });
      //this.data.paginator = this.paginator;

      this.data.sort = this.sort;
      this.isLoading = false;
    }, error => this.utilService.ShowApiErrorMessage(error));
  }


  applyFilter(searchVal: any) {
    const search = searchVal;//.target.value as string;
    //if (search && search.length >= 3) {
    if (search) {
      this.searchValue = search;
      this.loadList(0, this.pageService.pageCount, this.searchValue, this.sortingOrder);
    }
  }
  private openDialogManage(id: number = 0, dbops: DBOperation, modalTitle: string, modalBtnTitle: string) {
    let dialogRef = this.utilService.openCrudDialog(this.dialog, CreateUpdateContractFormElementsComponent);
    (dialogRef.componentInstance as any).dbops = dbops;
    (dialogRef.componentInstance as any).modalTitle = modalTitle;
    (dialogRef.componentInstance as any).modalBtnTitle = modalBtnTitle;
    (dialogRef.componentInstance as any).id = id;

    dialogRef.afterClosed().subscribe(res => {
      if (res && res === true)
        this.initialLoading();
    });
  }

  public create() {
    this.openDialogManage(0, DBOperation.create, 'Adding_New_Contract_Form_Template_Element', 'Add');
  }

  public edit(id: number) {
    this.openDialogManage(id, DBOperation.update, 'Updating_Contract_form_Template_Element', 'Update');
  }
  public view(id: number) {
    this.openDialogManage(id, DBOperation.update, 'Contract_form_Template_Element', 'View');
  }
  public delete(id: number) {
    const dialogRef = this.utilService.openDeleteConfirmDialog(this.dialog, DeleteConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(canDelete => {
      if (canDelete && id > 0) {
        this.apiService.delete('ContractFormTemplateElements', id).subscribe(res => {
          this.utilService.OkMessage();
          this.ngOnInit();
        },
        );
      }
    },
      error => this.utilService.ShowApiErrorMessage(error));
  }
  submit() {

  }




  translateToolTip(msg: string) {
    return `${this.translate.instant(msg)}`;

  }
}